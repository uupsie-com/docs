# Webhooks

Webhooks send HTTP POST requests to your URL when events occur. Use them to integrate Uupsie with your own systems.

## Events

| Event | Description |
|-------|-------------|
| `monitor.status_changed` | Monitor went up, down, or degraded |
| `monitor.check_completed` | Every individual check result |
| `incident.created` | New incident opened |
| `incident.updated` | Incident status or severity changed |
| `incident.resolved` | Incident resolved |
| `incident.deleted` | Incident deleted |

## List Webhooks

```
GET /webhooks
```

## Get Webhook

```
GET /webhooks/:id
```

## Get Deliveries

```
GET /webhooks/:id/deliveries
```

Returns recent delivery attempts with status codes, response bodies, and timing.

**Response:**

```json
{
  "data": [
    {
      "id": "...",
      "webhook_id": "...",
      "event_type": "monitor.status_changed",
      "status_code": 200,
      "payload": { "..." },
      "response_body": "OK",
      "duration_ms": 150,
      "success": true,
      "attempted_at": "2026-04-15T12:00:00Z"
    }
  ]
}
```

## Create Webhook

```
POST /webhooks
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | Endpoint URL (max 2048 chars) |
| `events` | array | Yes | At least one event string |
| `description` | string | No | Description (max 255 chars) |
| `secret` | string | No | Signing secret (max 255 chars) |

**Example:**

```bash
curl -X POST https://api.uupsie.com/api/v1/webhooks \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/uupsie-webhook",
    "events": ["monitor.status_changed", "incident.created"],
    "secret": "whsec_your_signing_secret"
  }'
```

## Update Webhook

```
PUT /webhooks/:id
```

## Delete Webhook

```
DELETE /webhooks/:id
```

## Verifying Signatures

If you provide a `secret`, Uupsie signs each delivery with an HMAC-SHA256 signature in the `X-Uupsie-Signature` header. Verify it to ensure the payload is authentic:

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

## Response

```json
{
  "data": {
    "id": "...",
    "url": "https://example.com/uupsie-webhook",
    "format": "json",
    "events": ["monitor.status_changed"],
    "is_enabled": true,
    "description": "Production webhook",
    "created_at": "2026-04-01T00:00:00Z",
    "updated_at": "2026-04-15T12:00:00Z"
  }
}
```
