---
name: rest-api-conventions
description: >
  Use when generating REST controllers, DTOs, or any HTTP-facing code.
  Defines HTTP status mapping, URL naming, and pagination.
---

# REST API Conventions

Return the body directly. Errors are `ProblemDetail` (see problem-details-rfc9457).

## Layers and DTOs

- Controller → Service → Repository, one direction only. No Facade or UseCase layer.
- Services return DTOs. Entities never leave the service layer.
- DTOs are records. Response DTOs expose static `from()` / `of()` factories. No mapper library (MapStruct etc.).

## HTTP Status Mapping

| Scenario | Status |
|----------|--------|
| GET — found | 200 |
| POST — created resource | 201 |
| PUT/PATCH — updated | 200 |
| DELETE — deleted | 204 (no body) |
| Validation failure | 400 |
| Unauthenticated | 401 |
| Forbidden | 403 |
| Not found | 404 |
| Conflict (duplicate) | 409 |
| Unhandled server error | 500 |

## URL Conventions

- **Plural nouns** for resources: `/orders`, `/users`, `/products`
- **Kebab-case** for multi-word: `/order-items`, not `/orderItems`
- **No version prefix** in paths: `/orders`, not `/api/v1/orders`
- **Nested resources** max 2 levels: `/orders/{id}/items` ✅, `/orders/{id}/items/{itemId}/notes` ❌ — flatten to `/order-item-notes/{id}`
- **IDs as `Long`** in path: `/orders/{id}` with `@PathVariable Long id`

```
GET    /orders              → list (paginated)
POST   /orders              → create
GET    /orders/{id}         → get one
PUT    /orders/{id}         → full update
PATCH  /orders/{id}         → partial update
DELETE /orders/{id}         → delete
GET    /orders/{id}/items   → nested resource
```

## Pagination

```json
{
  "content": [...],
  "page": 0,
  "size": 20,
  "totalElements": 150,
  "totalPages": 8,
  "last": false
}
```

Query params: `?page=0&size=20&sort=createdAt,desc`

Use Spring Data `Pageable` in controllers. The service returns `Page<OrderResponse>`:
```java
@GetMapping
public Page<OrderResponse> list(Pageable pageable) {
    return orderService.findAll(pageable);
}
```

**Cap the page size.** A bare `Pageable` accepts `?size=100000` from any client — one request can
drag your whole table into memory. Spring's default cap is 2000, still too high for most APIs:

```yaml
spring:
  data:
    web:
      pageable:
        default-page-size: 20
        max-page-size: 100   # requests above this are silently clamped
```

## Gotchas
- Agent wraps responses in an envelope — return the body directly; errors are `ProblemDetail`
- Agent uses `ResponseEntity<Map<String, Object>>` for errors — use `ProblemDetail`
- Agent puts exception handlers in controllers — use the single `GlobalExceptionHandler` (`@RestControllerAdvice`)
- Agent uses UUID or a `/api/v1` prefix — ids are `Long`, paths have no version prefix
- Agent accepts unbounded `Pageable` — set `spring.data.web.pageable.max-page-size` or one request can pull the whole table
- Agent returns `Page<Entity>` serialized directly — exposes Hibernate internals; the service must return DTOs
