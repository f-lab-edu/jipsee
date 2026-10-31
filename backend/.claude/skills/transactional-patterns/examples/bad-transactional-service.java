// ❌ BAD — every common @Transactional mistake

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order findById(Long id) {                      // missing readOnly = true; returns entity, not DTO
        return orderRepository.findById(id).orElse(null);
    }

    @Transactional
    public void processOrders(List<Long> orderIds) {
        for (Long id : orderIds) {
            this.processSingle(id);                       // self-invocation — proxy is bypassed, no TX
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)  // never reached via self-invocation
    private void processSingle(Long id) {                   // private method — proxy can't intercept
        Order order = orderRepository.findById(id).orElseThrow();
        order.process();
    }

    @Transactional
    public void createOrder(CreateOrderRequest request) {
        try {
            Order order = Order.create(request.customerEmail());
            orderRepository.save(order);
            riskyExternalCall(order);
        } catch (Exception e) {
            log.error("Failed", e);                       // swallows exception — rollback never triggers
        }
    }

    @Transactional
    public void updateOrder(Long id, UpdateOrderRequest request) {
        Order order = orderRepository.findById(id).orElseThrow();
        order.update(request);
        // external call inside the transaction — holds the DB connection and locks while waiting on the network,
        // and the remote side cannot be rolled back if this TX fails later
        paymentClient.charge(order.getId(), request.amount());
    }
}
