// ✅ GOOD — Long IDENTITY id, STRING enum with columnDefinition, LAZY fetch, BaseEntity, behavior methods, no setters
// Lombok limited to @Getter + @NoArgsConstructor(PROTECTED); constructor and factory are hand-written

import kr.jipsee.global.core.exception.BusinessException;
import kr.jipsee.global.core.exception.ErrorCode;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "orders", indexes = {
    @Index(name = "idx_orders_status", columnList = "status"),
    @Index(name = "idx_orders_customer_email", columnList = "customer_email")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_email", nullable = false)
    private String customerEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(20)")
    private OrderStatus status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private Order(String customerEmail, User user) {
        this.customerEmail = customerEmail;
        this.user = user;
        this.status = OrderStatus.PENDING;
    }

    public static Order create(String customerEmail, User user) {
        return new Order(customerEmail, user);
    }

    public void addItem(Product product, int quantity) {
        if (status != OrderStatus.PENDING)
            throw new BusinessException(ErrorCode.INVALID_ORDER_STATE);
        items.add(OrderItem.create(this, product, quantity));
    }

    public void confirm() {
        if (status != OrderStatus.PENDING)
            throw new BusinessException(ErrorCode.INVALID_ORDER_STATE);
        this.status = OrderStatus.CONFIRMED;
    }

    public void ship() {
        if (status != OrderStatus.CONFIRMED)
            throw new BusinessException(ErrorCode.INVALID_ORDER_STATE);
        this.status = OrderStatus.SHIPPED;
    }
}

// Domain errors: BusinessException + ErrorCode constant (INVALID_ORDER_STATE is added to the enum)
