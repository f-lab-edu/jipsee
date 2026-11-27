// ✅ GOOD: success body wrapped in `ApiResponse`, correct status, service returns domain DTOs and the controller maps them to response DTOs, no entity leakage

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> create(
        @Valid @RequestBody CreateOrderRequest request
    ) {
        OrderSummary order = orderService.create(request.toCommand());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(OrderResponse.from(order)));
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> getById(@PathVariable Long id) {
        return ApiResponse.of(OrderResponse.from(orderService.findById(id))); // throws BusinessException(ORDER_NOT_FOUND) when missing
    }

    @GetMapping
    public ApiResponse<Page<OrderResponse>> list(Pageable pageable) {
        return ApiResponse.of(orderService.findAll(pageable).map(OrderResponse::from));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        orderService.delete(id);
    }
}
