# API Tokens

API tokens provide programmatic access to the Uupsie API. Tokens are scoped to your organization.

## List Tokens

```
GET /tokens
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "CI/CD Token",
      "abilities": ["*"],
      "last_used_at": "2026-04-15T12:00:00Z",
      "created_at": "2026-04-01T00:00:00Z"
    }
  ]
}
```

## Create Token

```
POST /tokens
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Token name (max 255 chars) |

**Example:**

```bash
curl -X POST https://api.uupsie.com/api/v1/tokens \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "CI/CD Token"}'
```

**Response:**

```json
{
  "data": {
    "id": 2,
    "name": "CI/CD Token",
    "plain_text_token": "2|abc123def456...",
    "created_at": "2026-04-15T12:00:00Z"
  }
}
```

::: warning
The `plain_text_token` is only returned once at creation time. Store it securely — you won't be able to retrieve it again.
:::

## Delete Token

```
DELETE /tokens/:id
```

Returns `204 No Content`. The token is immediately revoked.
