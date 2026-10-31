---
name: transactional-patterns
description: >
  Use when working with @Transactional, multi-step database operations, or any code that
  needs atomicity guarantees. Covers propagation rules, read-only optimization, side effects
  after commit, and common pitfalls.
---

# Transactional Patterns

## Basic Rules

- `@Transactional` belongs on **service methods**, never controllers or repositories
- Default propagation is `REQUIRED` — joins existing transaction or creates one
- Services are annotated at class level with `@Transactional(readOnly = true)`; each write method gets its own `@Transactional`
- Service methods take ids (not entities) and return DTOs — entities never leave the service

```java
@Service
@Transactional(readOnly = true) // default for all methods in this service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final InventoryService inventoryService;

    @Transactional // overrides readOnly for writes
    public OrderResponse createOrder(CreateOrderRequest request) {
        inventoryService.reserve(request.items()); // participates in same TX
        Order order = orderRepository.save(Order.create(request.customerEmail()));
        return OrderResponse.from(order);
    }

    public OrderResponse findById(Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND)); // readOnly = true inherited
        return OrderResponse.from(order);
    }
}
```

`readOnly = true` sets Hibernate's flush mode to manual (no dirty checking) and passes a read-only hint to the JDBC connection. It does not route to a replica.

## Propagation

| Propagation | Behavior |
|-------------|----------|
| `REQUIRED` (default) | Join existing TX or create new |
| `REQUIRES_NEW` | Always create new TX, suspend existing |
| `SUPPORTS` | Join if exists, proceed without TX if not |
| `NOT_SUPPORTED` | Always run without TX |
| `MANDATORY` | Must have existing TX, throw if not |
| `NEVER` | Must NOT have TX, throw if one exists |

```java
// REQUIRES_NEW — for audit logging that must survive rollback (separate bean)
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void logAuditEvent(AuditEvent event) {
    auditRepository.save(event); // commits independently of parent TX
}

// Order TX rolls back, audit log still saved
@Transactional
public void processOrder(Long orderId) {
    Order order = getOrder(orderId);
    try {
        order.process(); // may throw
    } catch (RuntimeException e) {
        auditService.logAuditEvent(new AuditEvent("ORDER_FAILED", orderId)); // id only, no FK
        throw e; // parent TX rolls back, audit TX already committed
    }
}
```

**MySQL lock-wait warning:** the `REQUIRES_NEW` transaction is a separate connection. If it inserts a row with a
foreign key to a row the outer transaction just inserted or updated, it waits on the outer transaction's lock,
and the outer transaction waits for the inner call to return. Result: lock wait timeout. Avoid it by either:

- Using `@TransactionalEventListener(phase = AFTER_COMMIT)` for audit that only needs to exist after success (see "Side Effects After Commit")
- Passing only the id and storing it in a plain column without an FK constraint (as in the example above)

## Self-Invocation Pitfall

```java
// ❌ BROKEN — self-invocation bypasses Spring proxy, @Transactional ignored
@Service
public class OrderService {
    @Transactional
    public void processAll(List<Long> ids) {
        ids.forEach(id -> this.processSingle(id)); // bypasses proxy!
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void processSingle(Long id) { ... } // never creates new TX
}

// ✅ FIX — extract to separate bean
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderProcessor orderProcessor; // separate bean

    @Transactional
    public void processAll(List<Long> ids) {
        ids.forEach(id -> orderProcessor.processSingle(id)); // goes through proxy
    }
}
```

## Handling Exceptions

`BusinessException` extends `RuntimeException`, so the default rollback rule applies. Plain `@Transactional` is enough; no `rollbackFor`.

```java
@Transactional
public OrderResponse createOrder(CreateOrderRequest request) {
    ... // any RuntimeException (e.g. `BusinessException`) rolls back
}
```

Never swallow an exception inside a `@Transactional` method (`catch` and log only) — the TX commits as if nothing failed.

If a call needs a retry (e.g. deadlock or lock wait timeout), retry outside the transactional bean, so each attempt gets a fresh transaction.

## No External Calls Inside a Transaction

Do not call external APIs (HTTP clients, payment, messaging) inside a transaction. The DB connection and locks stay held while waiting on the network, and the remote side cannot be rolled back. Do the external call before or after the transaction, or bind it to the commit (next section).

## Side Effects After Commit

Never fire an external side effect (email, Kafka publish, webhook, cache warm) inside the transaction —
if the TX rolls back, you've already sent it. Bind the side effect to the commit instead:

```java
// Publisher — inside the TX
@Transactional
public OrderResponse place(Long id) {
    Order order = getOrder(id);
    order.place();
    eventPublisher.publishEvent(new OrderPlaced(order.getId())); // not sent yet
    return OrderResponse.from(order);
}

// Listener — runs ONLY if the TX commits successfully
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
public void onOrderPlaced(OrderPlaced event) {
    emailService.sendConfirmation(event.orderId()); // safe: data is durable
}
```

`AFTER_COMMIT` runs after the DB commits. Note: it runs **outside** the original transaction, so a
new `@Transactional(REQUIRES_NEW)` is needed if the listener itself writes to the DB.

## Gotchas
- Agent puts `@Transactional` on controllers — only on service layer
- Agent sends email / publishes events / calls external APIs inside the TX — use `@TransactionalEventListener(AFTER_COMMIT)` or call outside the TX
- Agent forgets `readOnly = true` on read methods — put it at class level and override write methods with `@Transactional`
- Agent calls `@Transactional` methods on `this` — self-invocation bypasses proxy
- Agent adds `rollbackFor` — `BusinessException` is a `RuntimeException`, default rollback applies
- Agent uses `@Transactional` on `private` methods — Spring proxy can't intercept
- Agent returns entities or takes entities as parameters on services — use ids in, DTOs out
- Agent uses `REQUIRES_NEW` to insert an FK row to a row the outer TX just wrote — MySQL lock wait timeout
