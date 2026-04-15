# Maintenance Windows

Schedule planned maintenance to suppress false alerts and inform your status page subscribers.

## List Maintenance Windows

```
GET /maintenance-windows
```

## Get Maintenance Window

```
GET /maintenance-windows/:id
```

## Create Maintenance Window

```
POST /maintenance-windows
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Title (max 255 chars) |
| `description` | string | No | Description (max 10,000 chars, supports Markdown) |
| `scheduled_start` | string | Yes | ISO 8601 datetime, must be in the future |
| `scheduled_end` | string | Yes | ISO 8601 datetime, must be after `scheduled_start` |
| `status` | string | No | `scheduled`, `in_progress`, `completed` (default `scheduled`) |
| `monitor_ids` | array | No | UUIDs of monitors affected by this maintenance |

**Example:**

```bash
curl -X POST https://api.uupsie.com/api/v1/maintenance-windows \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Database migration",
    "description": "Upgrading PostgreSQL from 15 to 16. Expected 15 minutes of downtime.",
    "scheduled_start": "2026-04-20T02:00:00Z",
    "scheduled_end": "2026-04-20T02:30:00Z",
    "monitor_ids": ["550e8400-e29b-41d4-a716-446655440000"]
  }'
```

## Update Maintenance Window

```
PUT /maintenance-windows/:id
```

Same parameters, all optional.

## Delete Maintenance Window

```
DELETE /maintenance-windows/:id
```

## Response

```json
{
  "data": {
    "id": "...",
    "title": "Database migration",
    "description": "Upgrading PostgreSQL from 15 to 16.",
    "scheduled_start": "2026-04-20T02:00:00Z",
    "scheduled_end": "2026-04-20T02:30:00Z",
    "actual_start": null,
    "actual_end": null,
    "status": "scheduled",
    "monitors": [...],
    "created_at": "2026-04-15T12:00:00Z",
    "updated_at": "2026-04-15T12:00:00Z"
  }
}
```

::: tip
Maintenance windows automatically appear on status pages that include the affected monitors.
:::
