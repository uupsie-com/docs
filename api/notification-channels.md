# Notification Channels

Notification channels define where alerts are sent when monitor status changes or incidents occur.

## Supported Types

| Type | Config Fields | Description |
|------|--------------|-------------|
| `email` | `recipients` (array of email addresses) | Email notifications |
| `slack` | `webhook_url` | Slack incoming webhook |
| `pagerduty` | `routing_key` | PagerDuty Events API v2 |

## Events

Channels can subscribe to any combination of these events:

| Event | Description |
|-------|-------------|
| `monitor.status_changed` | Monitor went up, down, or degraded |
| `monitor.check_completed` | Every individual check result |
| `incident.created` | New incident opened |
| `incident.updated` | Incident status or severity changed |
| `incident.resolved` | Incident resolved |
| `incident.deleted` | Incident deleted |

## List Channels

```
GET /notification-channels
```

## Get Channel

```
GET /notification-channels/:id
```

## Get Deliveries

```
GET /notification-channels/:id/deliveries
```

Returns recent delivery attempts for the channel.

## Create Channel

```
POST /notification-channels
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Display name (max 255) |
| `type` | string | Yes | `email`, `slack`, or `pagerduty` |
| `config` | object | Yes | Type-specific config (see above) |
| `events` | array | No | Array of event strings to subscribe to |
| `is_enabled` | boolean | No | Enable/disable (default `true`) |

**Example — Slack:**

```bash
curl -X POST https://api.uupsie.com/api/v1/notification-channels \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering Slack",
    "type": "slack",
    "config": {
      "webhook_url": "https://hooks.slack.com/services/T.../B.../xxx"
    },
    "events": ["monitor.status_changed", "incident.created", "incident.resolved"]
  }'
```

**Example — Email:**

```bash
curl -X POST https://api.uupsie.com/api/v1/notification-channels \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "On-Call Email",
    "type": "email",
    "config": {
      "recipients": ["oncall@example.com", "eng-lead@example.com"]
    },
    "events": ["monitor.status_changed"]
  }'
```

## Update Channel

```
PUT /notification-channels/:id
```

Same parameters, all optional.

## Delete Channel

```
DELETE /notification-channels/:id
```

## Response

```json
{
  "data": {
    "id": "...",
    "name": "Engineering Slack",
    "type": "slack",
    "config": {
      "webhook_url": "https://hooks.slack.com/s••••••••"
    },
    "events": ["monitor.status_changed", "incident.created"],
    "is_enabled": true,
    "last_delivery": {
      "status": "success",
      "attempted_at": "2026-04-15T12:00:00Z",
      "error_message": null
    },
    "created_at": "2026-04-01T00:00:00Z",
    "updated_at": "2026-04-15T12:00:00Z"
  }
}
```

::: info
Sensitive config values (webhook URLs, routing keys) are partially masked in API responses.
:::
