// ✅ GOOD — class-level readOnly, method-level override, ids in / DTOs out, side effects bound to commit

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher eventPublisher;

    public OrderResponse findById(Long id) {
        return OrderResponse.from(getOrder(id));
    }

    public Page<OrderResponse> findAll(Pageable pageable) {
        return orderRepository.findAll(pageable).map(OrderResponse::from);
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        Order order = orderRepository.save(Order.create(request.customerEmail()));
        eventPublisher.publishEvent(new OrderCreated(order.getId())); // handled after commit
        return OrderResponse.from(order);
    }

    @Transactional
    public void cancel(Long id) {
        Order order = getOrder(id);
        order.cancel();
        eventPublisher.publishEvent(new OrderCancelled(order.getId()));
    }

    private Order getOrder(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND)); // RuntimeException: default rollback applies
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
