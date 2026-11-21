// ✅ GOOD: body returned directly, correct status, service returns domain DTOs and the controller maps them to response DTOs, no entity leakage

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> create(
        @Valid @RequestBody CreateOrderRequest request
    ) {
        OrderSummary order = orderService.create(request.toCommand());
        return ResponseEntity.status(HttpStatus.CREATED).body(OrderResponse.from(order));
    }

    @GetMapping("/{id}")
    public OrderResponse getById(@PathVariable Long id) {
        return OrderResponse.from(orderService.findById(id));   // throws BusinessException(ORDER_NOT_FOUND) when missing
    }

    @GetMapping
    public Page<OrderResponse> list(Pageable pageable) {
        return orderService.findAll(pageable).map(OrderResponse::from);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        orderService.delete(id);
    }
}
