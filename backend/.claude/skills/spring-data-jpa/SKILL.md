---
name: spring-data-jpa
description: >
  Use when generating JPA entities, repositories, queries, or anything touching the persistence
  layer. Covers entity conventions, N+1 prevention, projections, and query patterns.
---

# Spring Data JPA

## Entity Conventions

```java
@Entity
@Table(name = "orders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA requires no-arg, hidden from callers
public class Order extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerEmail;

    @Enumerated(EnumType.STRING) // always STRING, never ORDINAL
    @Column(nullable = false, columnDefinition = "varchar(20)") // match the DDL length
    private OrderStatus status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    private Order(String customerEmail) {
        this.customerEmail = customerEmail;
        this.status = OrderStatus.PENDING;
    }

    // Static factory, not public constructor
    public static Order create(String customerEmail) {
        return new Order(customerEmail);
    }

    // Behavior on entity, not in service
    public void addItem(Product product, int quantity) {
        items.add(OrderItem.create(this, product, quantity));
    }
}
```

## BaseEntity

Every table has `created_at` / `updated_at`. JPA entities extend `kr.jipsee.global.common.base.BaseEntity`, which fills them with Hibernate `@CreationTimestamp` / `@UpdateTimestamp`. No JPA auditing (`@EnableJpaAuditing`, `@CreatedDate`).
Tables written with `JdbcTemplate` leave both columns out of the INSERT; the MySQL column defaults fill them. Keep the JVM and MySQL time zones the same.

```java
@Getter
@MappedSuperclass
public abstract class BaseEntity {

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

## Rules
- `@Enumerated(EnumType.STRING)` always, with `columnDefinition = "varchar(N)"` matching the DDL (`ddl-auto: validate`) — `ORDINAL` breaks on enum reordering
- IDs are `Long` with `@GeneratedValue(strategy = GenerationType.IDENTITY)` — never UUID
- Lombok is limited to `@Getter`, `@NoArgsConstructor(access = AccessLevel.PROTECTED)`, `@RequiredArgsConstructor`, `@Slf4j` — never `@Setter`, `@Data`, `@Builder`, `@AllArgsConstructor`
- Entities carry `@Getter` and `@NoArgsConstructor(access = AccessLevel.PROTECTED)` — the no-arg constructor is required by JPA and hidden from app code
- No setters on entities (use behavior methods)
- Create entities through a constructor or static factory
- `@ManyToOne(fetch = FetchType.LAZY)` always
- Collections initialized inline (`= new ArrayList<>()`) — never null
- The schema is managed outside this repo (no Flyway/migrations); entities are only validated

## N+1 Prevention

**Identify:** One query for orders + N queries for each order's items = N+1.

**Fix with JOIN FETCH:**
```java
@Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.id = :id")
Optional<Order> findByIdWithItems(@Param("id") Long id);

// For lists — use @EntityGraph to avoid N+1
@EntityGraph(attributePaths = {"items", "items.product"})
List<Order> findByStatus(OrderStatus status);
```

**Fix with Projections for read-only views:**
```java
// Record projection — no entity loaded
public record OrderSummary(Long id, String customerEmail, OrderStatus status, Instant createdAt) {}

List<OrderSummary> findByStatus(OrderStatus status); // fast, no lazy loading issues
```

## Query Patterns

```java
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Derived query — simple conditions
    List<Order> findByStatusAndCustomerEmail(OrderStatus status, String email);

    // JPQL — for joins and complex conditions
    @Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.status = :status")
    List<Order> findActiveOrdersWithItems(@Param("status") OrderStatus status);

    // Derived query with a time bound — compute the cutoff in the service
    List<Order> findByCreatedAtAfter(Instant since);

    // Exists check — faster than findById + isPresent
    boolean existsByCustomerEmailAndStatus(String email, OrderStatus status);

    // Projection
    List<OrderSummary> findByCustomerEmail(String email);
}
```

Spatial, FULLTEXT, and bulk SQL go through `JdbcTemplate`, not `@Query(nativeQuery = true)`.

## Pagination

```java
// Always use Pageable for list endpoints
Page<Order> findByStatus(OrderStatus status, Pageable pageable);

// In service — map to DTO, entities never leave the service
Page<OrderResponse> orders = orderRepository
    .findByStatus(status, PageRequest.of(page, size, Sort.by("createdAt").descending()))
    .map(OrderResponse::from);
```

## Bidirectional Relationships

```java
// Parent side (Order)
@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
private List<OrderItem> items = new ArrayList<>();

// Child side (OrderItem) — owns the FK
@ManyToOne(fetch = FetchType.LAZY) // LAZY always on @ManyToOne
@JoinColumn(name = "order_id", nullable = false)
private Order order;

// Keep both sides in sync through the parent's behavior method (see addItem above):
// OrderItem.create(this, product, quantity) sets the child's order in its factory
```

## Deep Pagination — Keyset over OFFSET

`OFFSET` pagination scans and discards every skipped row. On page 5,000 the DB reads 100,000 rows to
return 20. For large or infinite-scroll datasets, paginate by the last seen key (the "seek" method):

```java
// ❌ Slow on deep pages — OFFSET grows linearly
Page<Order> findByStatus(OrderStatus status, Pageable pageable);

// ✅ Keyset — constant time regardless of depth. Pass the last row's createdAt + id.
@Query("""
    SELECT o FROM Order o
    WHERE o.status = :status
      AND (o.createdAt < :lastCreatedAt
           OR (o.createdAt = :lastCreatedAt AND o.id < :lastId))
    ORDER BY o.createdAt DESC, o.id DESC
    """)
List<Order> findNextPage(OrderStatus status, Instant lastCreatedAt, Long lastId, Limit limit);
```

The `(createdAt, id)` tuple breaks ties so the cursor is stable when timestamps collide. Index `(status, created_at DESC, id DESC)`.

## Bulk Inserts

`GenerationType.IDENTITY` prevents Hibernate insert batching on MySQL (Hibernate needs the generated key
per row), so `saveAll` on a big list is N round-trips. Use `JdbcTemplate.batchUpdate` for bulk inserts and
enable `rewriteBatchedStatements=true` on the JDBC URL so the driver rewrites them into multi-row inserts:

```
jdbc:mysql://localhost:3306/jipsee?rewriteBatchedStatements=true
```

```java
jdbcTemplate.batchUpdate(
    "INSERT INTO orders (customer_email, status, created_at, updated_at) VALUES (?, ?, ?, ?)",
    orders,
    500,
    (ps, order) -> {
        ps.setString(1, order.customerEmail());
        ps.setString(2, OrderStatus.PENDING.name());
        ps.setTimestamp(3, Timestamp.from(now));
        ps.setTimestamp(4, Timestamp.from(now));
    });
```

`JdbcTemplate` bypasses auditing, so set `created_at` / `updated_at` yourself.

## Gotchas
- Agent uses `FetchType.EAGER` — always use `LAZY` on `@ManyToOne` and `@ManyToMany`
- Agent uses `@Enumerated(EnumType.ORDINAL)` — always use `STRING`
- Agent uses UUID ids — use `Long` + `IDENTITY`
- Agent calls `findAll()` for list endpoints — always use `Pageable`
- Agent uses `OFFSET` pagination on huge tables — switch to keyset for deep pages
- Agent adds setters to entities — use behavior methods instead
- Agent forgets `orphanRemoval = true` on `@OneToMany` — child records become orphans
- Agent writes N+1 without realizing — check for `items` access in loops
- Agent expects Hibernate to batch IDENTITY inserts — use `JdbcTemplate.batchUpdate`
- Agent uses `@Setter` / `@Data` / `@Builder` / `@AllArgsConstructor` — only `@Getter`, `@NoArgsConstructor(access = AccessLevel.PROTECTED)`, `@RequiredArgsConstructor`, `@Slf4j` are allowed
- Agent declares `createdAt` / `updatedAt` on an entity — extend `BaseEntity` instead
