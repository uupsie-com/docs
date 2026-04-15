# Rate Limits & Errors

## Rate Limits

The API applies rate limiting on a per-token basis. If you exceed the limit, you'll receive a `429 Too Many Requests` response.

| Endpoint | Limit |
|----------|-------|
| Most endpoints | 60 requests/minute |
| Login | 5 requests/minute |
| Domain verification | 3 requests/minute |
| Subscriber signup | 5 requests/minute |

Rate-limited responses include a `Retry-After` header indicating how many seconds to wait.

## Error Format

All error responses follow a consistent JSON structure:

```json
{
  "message": "A human-readable error description."
}
```

Validation errors (422) include field-level detail:

```json
{
  "message": "The name field is required.",
  "errors": {
    "name": ["The name field is required."]
  }
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `204` | Deleted (no content) |
| `401` | Unauthenticated — missing or invalid token |
| `403` | Forbidden — insufficient permissions |
| `404` | Resource not found |
| `422` | Validation error |
| `429` | Rate limited |
| `500` | Server error |

## Pagination

List endpoints return paginated results:

```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "per_page": 25,
    "total": 100,
    "last_page": 4
  }
}
```

Use `?page=2&per_page=50` query parameters to navigate. Maximum `per_page` is `100`.
