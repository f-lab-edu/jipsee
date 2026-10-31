// ❌ BAD — every common JPA mistake

import lombok.Setter;

@Entity
@Setter                                 // BAD: setters banned on entities (also @Data, @Builder, @AllArgsConstructor) — use behavior methods
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerEmail;       // missing @Column constraints

    @Enumerated(EnumType.ORDINAL)       // ORDINAL breaks if enum is reordered; also no columnDefinition = "varchar(N)"
    private OrderStatus status;

    @OneToMany                          // missing cascade, orphanRemoval
    private List<OrderItem> items;      // not initialized — NPE waiting to happen

    @ManyToOne                          // missing fetch = LAZY — EAGER by default = N+1
    private User user;

    // No @NoArgsConstructor(access = AccessLevel.PROTECTED) — JPA no-arg constructor not hidden from callers
    // Does not extend BaseEntity (no createdAt / updatedAt auditing)
    // No factory method — public constructor allows invalid state
    // No behavior methods — service has to know internal rules
}
