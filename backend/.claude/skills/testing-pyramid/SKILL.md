---
name: testing-pyramid
description: >
  Use when writing tests of any kind — unit, slice, or integration. Covers test structure,
  naming conventions, BDDMockito patterns, @WebMvcTest, @DataJpaTest, and Testcontainers MySQL setup
  for Spring Boot 4.
---

# Testing Pyramid

## Structure

```
Unit Tests         — fast, no Spring context, mock dependencies    (70%)
Slice Tests        — partial Spring context (@WebMvcTest, @DataJpaTest) (20%)
Integration Tests  — full context + real MySQL via Testcontainers  (10%)
```

Test packages mirror main packages: `src/main/java/kr/jipsee/<domain>/application/OrderService.java`
is tested by `src/test/java/kr/jipsee/<domain>/application/OrderServiceTest.java`.

## Conventions (all test levels)

- Unit tests use `@ExtendWith(MockitoExtension.class)`, `@InjectMocks`, `@Mock`, BDDMockito, and AssertJ.
- Stubbing: `given(..).willReturn(..)`, `willThrow(..).given(mock).method(..)`, `willDoNothing().given(mock).method(..)`.
- Verification: `then(mock).should().method(..)`. Do not use `when/thenReturn/doThrow/verify`.
- Body is split with lowercase `// given`, `// when`, `// then` comments.
- For exceptions, run the call under `// when` with `Throwable thrown = catchThrowable(...)`, then assert under `// then`. Use `assertThatThrownBy` under `// when & then` only if unavoidable.
- Group cases with `@Nested` by state or feature. A nested class can carry its own Korean `@DisplayName`.
- Services return DTOs (records such as `OrderResponse`), never entities. Stubs and assertions at the service boundary use DTOs.
- Entity IDs are `Long`, never `UUID`.

## Unit Tests — Services

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private InventoryService inventoryService;

    @InjectMocks private OrderService orderService;

    @Nested
    @DisplayName("주문 생성")
    class CreateOrder {

        @Test
        @DisplayName("재고가 있으면 주문을 저장하고 반환함")
        void 재고가_있으면_주문을_저장하고_반환함() {
            // given
            var request = new CreateOrderRequest("user@example.com", List.of(new OrderItemRequest(1L, 2)));
            var savedOrder = Order.create("user@example.com");
            given(orderRepository.save(any(Order.class))).willReturn(savedOrder);
            willDoNothing().given(inventoryService).reserve(any());

            // when
            OrderResponse result = orderService.createOrder(request);

            // then
            assertThat(result.customerEmail()).isEqualTo("user@example.com");
            then(inventoryService).should().reserve(request.items());
            then(orderRepository).should().save(any(Order.class));
        }

        @Test
        @DisplayName("재고가 부족하면 OUT_OF_STOCK 오류를 던짐")
        void 재고가_부족하면_OUT_OF_STOCK_오류를_던짐() {
            // given
            var request = new CreateOrderRequest("user@example.com", List.of());
            willThrow(new BusinessException(ErrorCode.OUT_OF_STOCK))
                .given(inventoryService).reserve(any());

            // when
            Throwable thrown = catchThrowable(() -> orderService.createOrder(request));

            // then
            assertThat(thrown)
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.OUT_OF_STOCK);
            then(orderRepository).shouldHaveNoInteractions();
        }
    }
}
```

## Slice Tests — Controllers (@WebMvcTest)

```java
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import tools.jackson.databind.json.JsonMapper;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired JsonMapper jsonMapper; // Jackson 3, not com.fasterxml ObjectMapper
    @MockitoBean OrderService orderService;

    @Nested
    @DisplayName("POST /orders")
    class CreateOrder {

        @Test
        @DisplayName("유효한 요청이면 201과 생성된 주문을 반환함")
        void 유효한_요청이면_201과_생성된_주문을_반환함() throws Exception {
            // given
            var request = new CreateOrderRequest("user@example.com", List.of());
            given(orderService.createOrder(any())).willReturn(new OrderResponse(1L, "user@example.com"));

            // when
            var result = mockMvc.perform(post("/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonMapper.writeValueAsString(request)));

            // then
            result.andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.customerEmail").value("user@example.com"));
        }

        @Test
        @DisplayName("필수 값이 없으면 400과 ProblemDetail을 반환함")
        void 필수_값이_없으면_400과_ProblemDetail을_반환함() throws Exception {
            // when
            var result = mockMvc.perform(post("/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}")); // missing required fields

            // then
            result.andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.detail").isNotEmpty());
        }
    }
}
```

Success bodies are the DTO itself, so assert `$.id` and `$.customerEmail` directly. Errors are RFC 9457 `ProblemDetail` (`application/problem+json`): assert `$.status` and `$.detail`. The global `@RestControllerAdvice` is loaded by `@WebMvcTest`.

## Slice Tests — Repositories (@DataJpaTest)

```java
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase.Replace;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE) // use real MySQL (Testcontainers), never H2
@Import(TestcontainersConfig.class)
class OrderRepositoryTest {

    @Autowired OrderRepository orderRepository;

    @Nested
    @DisplayName("상태별 주문 조회")
    class FindByStatus {

        @Test
        @DisplayName("대기 중인 주문만 조회함")
        void 대기_중인_주문만_조회함() {
            // given
            orderRepository.save(Order.create("a@example.com"));
            var shipped = orderRepository.save(Order.create("b@example.com"));
            shipped.ship(); // change status
            orderRepository.save(shipped);

            // when
            List<Order> pending = orderRepository.findByStatus(OrderStatus.PENDING, Pageable.unpaged()).getContent();

            // then
            assertThat(pending).hasSize(1);
            assertThat(pending.get(0).getCustomerEmail()).isEqualTo("a@example.com");
        }
    }
}
```

Repository tests may touch entities directly. The "no entities outside the service layer" rule applies to service return values.

## Integration Tests — Testcontainers MySQL

```java
// Shared config — reuse container across tests
@TestConfiguration(proxyBeanMethods = false)
public class TestcontainersConfig {

    @Bean
    @ServiceConnection
    MySQLContainer mysqlContainer() {
        // keep the tag identical to the mysql image in backend/compose.yaml
        return new MySQLContainer("mysql:8.4.11");
    }
}

// Full integration test
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureRestTestClient
@Import(TestcontainersConfig.class)
class OrderIntegrationTest {

    @Autowired RestTestClient restTestClient;
    @Autowired OrderRepository orderRepository;

    @Nested
    @DisplayName("주문 생성과 조회")
    class CreateAndRetrieve {

        @Test
        @DisplayName("주문을 생성하면 201을 반환하고 주문이 저장됨")
        void 주문을_생성하면_201을_반환하고_주문이_저장됨() {
            // given
            var request = new CreateOrderRequest("user@example.com", List.of());

            // when
            var response = restTestClient.post().uri("/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .exchange();

            // then
            response.expectStatus().isCreated();
            OrderResponse body = response.expectBody(OrderResponse.class).returnResult().getResponseBody();
            assertThat(body.customerEmail()).isEqualTo("user@example.com");
            assertThat(orderRepository.findById(body.id())).isPresent();
        }
    }
}
```

### Schema in the container

- The repo ships no SQL and no migrations, and Spring does not run any. The schema SQL lives outside the repo (`$SCHEMA_DIR`, applied by the `flyway` service in `backend/compose.schema.yaml`).
- A fresh Testcontainers MySQL is empty. Apply the externally supplied schema to the container before the Spring context starts, for example by copying the SQL files from `$SCHEMA_DIR` into `/docker-entrypoint-initdb.d`.
- Keep `ddl-auto: validate`. Do not switch to `create` or `create-drop` to make tests pass; validation against the real schema is the point of these tests.

## Boot 4 Packages

| Need | Package / type |
|---|---|
| `@WebMvcTest`, `@AutoConfigureMockMvc` | `org.springframework.boot.webmvc.test.autoconfigure` |
| `@DataJpaTest` | `org.springframework.boot.data.jpa.test.autoconfigure` |
| `@AutoConfigureTestDatabase` | `org.springframework.boot.jdbc.test.autoconfigure` |
| `@MockitoBean`, `@MockitoSpyBean` | `org.springframework.test.context.bean.override.mockito` |
| `RestTestClient` | `org.springframework.test.web.servlet.client.RestTestClient` |
| `@AutoConfigureRestTestClient` | `org.springframework.boot.resttestclient.autoconfigure` |
| `MySQLContainer` (non-generic) | `org.testcontainers.mysql.MySQLContainer` |
| `@ServiceConnection` | `org.springframework.boot.testcontainers.service.connection` |
| `JsonMapper` | `tools.jackson.databind.json.JsonMapper` |

`@SpringBootTest` no longer provides `MockMvc` by itself. Add `@AutoConfigureMockMvc` if a full-context test needs it.

## Naming Convention

`@DisplayName` is a Korean sentence ending in noun form (`-음`/`-함`). The method name is the same sentence with words joined by `_`.

```java
@DisplayName("재고가 있으면 주문을 저장하고 반환함")
void 재고가_있으면_주문을_저장하고_반환함()

@DisplayName("존재하지 않는 주문을 조회하면 ORDER_NOT_FOUND 오류를 던짐")
void 존재하지_않는_주문을_조회하면_ORDER_NOT_FOUND_오류를_던짐()

@DisplayName("이미 종료된 주문은 취소할 수 없음")
void 이미_종료된_주문은_취소할_수_없음()
```

- Keep particles and endings. Do not compress into noun stacks: `재고있음_저장` is wrong; `재고가_있으면_주문을_저장함` is right.
- Do not use stiff Sino-Korean shorthand when a plain verb works: `미존재` becomes `존재하지 않음`, `불가` becomes `할 수 없음`.
- Use the full state word: `활성화된`, `비활성화되어 있으면`, not bare `활성`/`비활성`.
- Group by state or feature with `@Nested` (class names in English, `@DisplayName` in Korean).

## Testcontainers Dependencies (Gradle Kotlin DSL)

Versions come from the Boot BOM.

```kotlin
dependencies {
    testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
    testImplementation("org.springframework.boot:spring-boot-starter-data-jpa-test")
    testImplementation("org.springframework.boot:spring-boot-testcontainers")
    testImplementation("org.testcontainers:testcontainers-junit-jupiter")
    testImplementation("org.testcontainers:testcontainers-mysql")
}
```

## Gotchas
- Agent uses `@SpringBootTest` for everything — use slices for speed
- Agent uses `H2` in-memory DB for `@DataJpaTest` — never; use Testcontainers MySQL (`mysql:8.4.11`), because spatial functions and FULLTEXT only work on MySQL
- Agent uses `@MockBean` — removed in Spring Boot 4; use `@MockitoBean` (and `@MockitoSpyBean` for spies) from `org.springframework.test.context.bean.override.mockito`
- Agent imports slice annotations from Boot 3 packages (`org.springframework.boot.test.autoconfigure...`) — use the Boot 4 packages in the table above
- Agent uses `TestRestTemplate` — use `RestTestClient` with `@AutoConfigureRestTestClient`
- Agent injects `com.fasterxml.jackson.databind.ObjectMapper` — inject `tools.jackson.databind.json.JsonMapper`
- Agent uses `Mockito.mock()` instead of `@Mock` — use annotations with `@ExtendWith(MockitoExtension.class)`
- Agent writes `when(..).thenReturn(..)`, `doThrow(..)`, `verify(..)` — use BDDMockito (`given`, `willThrow`, `then(..).should()`)
- Agent wraps responses in `ApiResponse` and asserts `$.success`, `$.data`, `$.error.code` — success bodies are returned directly, errors are ProblemDetail (`$.status`, `$.detail`)
- Agent stubs services to return entities or uses `UUID` ids — services return DTOs and ids are `Long`
- Agent adds `@WithMockUser` or Spring Security test setup — the project has no Spring Security
- Agent sets `ddl-auto: create` for tests, or expects the container to have a schema — the container is empty until the external schema is applied; keep `validate`
- Agent uses `assertEquals` from JUnit — use AssertJ (`assertThat(...).isEqualTo(...)`)
- Agent uses `assertThatThrownBy` by default or writes `// Given` — use `catchThrowable` under `// when`, and lowercase `// given`, `// when`, `// then`
- Agent names tests `test_createOrder()` or `createOrder_whenX_shouldY()` — use a Korean `@DisplayName` sentence and the same sentence as the method name joined by `_`
- Agent puts test classes in a different package from the class under test — mirror the main package
