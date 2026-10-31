package kr.jipsee.order.application;

import kr.jipsee.order.dao.AuditLogRepository;
import kr.jipsee.order.dao.OrderRepository;
import kr.jipsee.order.domain.AuditLog;
import kr.jipsee.order.domain.Order;
import kr.jipsee.order.domain.OrderNotFoundException;
import kr.jipsee.order.dto.CreateOrderRequest;
import kr.jipsee.order.dto.OrderResponse;
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
    public OrderResponse findById(Long id) {
        return OrderResponse.from(getOrder(id));
    }

    // Inherits class-level readOnly = true
    public Page<OrderResponse> findAll(Pageable pageable) {
        return orderRepository.findAll(pageable).map(OrderResponse::from);
    }

    // Override: write transaction. Custom exceptions are RuntimeException, so no rollbackFor
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        Order order = orderRepository.save(Order.create(request.customerEmail()));
        eventPublisher.publishEvent(new OrderCreated(order.getId()));
        return OrderResponse.from(order);
    }

    // Override: write transaction
    @Transactional
    public void cancel(Long id) {
        Order order = getOrder(id);
        order.cancel();
        eventPublisher.publishEvent(new OrderCancelled(order.getId()));
    }

    private Order getOrder(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new OrderNotFoundException(id));
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
