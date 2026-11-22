// ✅ GOOD: class-level readOnly, method-level override, ids in / domain DTOs out (BusinessException when the target must exist, no HTTP errors in core), side effects bound to commit

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher eventPublisher;

    public OrderSummary findById(Long id) {
        return orderRepository.findById(id)
                .map(OrderSummary::from)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND)); // the api handler returns 404
    }

    public Page<OrderSummary> findAll(Pageable pageable) {
        return orderRepository.findAll(pageable).map(OrderSummary::from);
    }

    @Transactional
    public OrderSummary createOrder(CreateOrderCommand command) {
        Order order = orderRepository.save(Order.create(command.customerEmail()));
        eventPublisher.publishEvent(new OrderCreated(order.getId())); // handled after commit
        return OrderSummary.from(order);
    }

    @Transactional
    public void cancel(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND)); // the api handler returns 404
        order.cancel();
        eventPublisher.publishEvent(new OrderCancelled(order.getId()));
    }
}

record OrderCreated(Long orderId) {}
record OrderCancelled(Long orderId) {}

// Separate bean. Runs only after the order TX commits, in its own TX.
// Stores the plain orderId column (no FK), so it never waits on the outer TX's locks.
@Service
@RequiredArgsConstructor
class OrderAuditService {

    private final AuditLogRepository auditLogRepository;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onOrderCreated(OrderCreated event) {
        auditLogRepository.save(AuditLog.orderCreated(event.orderId()));
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onOrderCancelled(OrderCancelled event) {
        auditLogRepository.save(AuditLog.orderCancelled(event.orderId()));
    }
}
