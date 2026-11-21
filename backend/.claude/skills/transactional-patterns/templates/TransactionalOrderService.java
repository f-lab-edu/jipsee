package kr.jipsee.order;

import kr.jipsee.global.exception.BusinessException;
import kr.jipsee.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
@Transactional(readOnly = true)  // default: all public methods are read-only (flush mode manual, JDBC read-only hint; no replica routing)
@RequiredArgsConstructor
public class TransactionalOrderService {

    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher eventPublisher;

    // Inherits class-level readOnly = true
    public OrderSummary findById(Long id) {
        return orderRepository.findById(id)
                .map(OrderSummary::from)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND)); // the target must exist, so the api handler returns 404
    }

    // Inherits class-level readOnly = true
    public Page<OrderSummary> findAll(Pageable pageable) {
        return orderRepository.findAll(pageable).map(OrderSummary::from);
    }

    // Override: write transaction. Any RuntimeException rolls back, so no rollbackFor
    @Transactional
    public OrderSummary createOrder(CreateOrderCommand command) {
        Order order = orderRepository.save(Order.create(command.customerEmail()));
        eventPublisher.publishEvent(new OrderCreated(order.getId()));
        return OrderSummary.from(order);
    }

    // Override: write transaction
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

/**
 * Separate bean for the audit write. Runs only after the order TX commits, in its own TX.
 * REQUIRES_NEW via self-invocation does NOT work (Spring proxy is bypassed), so keep it in its own bean.
 * Stores only the order id in a plain column (no FK), so it never waits on the outer TX's locks.
 */
@Slf4j
@Service
@RequiredArgsConstructor
class OrderAuditService {

    private final AuditLogRepository auditLogRepository;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onOrderCreated(OrderCreated event) {
        auditLogRepository.save(AuditLog.orderCreated(event.orderId()));
        log.info("Audit logged: order created {}", event.orderId());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onOrderCancelled(OrderCancelled event) {
        auditLogRepository.save(AuditLog.orderCancelled(event.orderId()));
        log.info("Audit logged: order cancelled {}", event.orderId());
    }
}
