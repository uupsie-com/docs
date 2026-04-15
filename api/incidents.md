# Incidents

Incidents represent downtime events tied to a specific monitor. They can be created automatically by Beacon when a monitor goes down, or manually via the API.

## List Incidents

```
GET /incidents
```

Returns a paginated list of all incidents in your organization, ordered by most recent.

**Response:**

```json
{
  "data": [
    {
      "id": "...",
      "monitor_id": "...",
      "monitor": { "id": "...", "name": "Production API" },
      "title": "Production API is down",
      "status": "investigating",
      "severity": "outage",
      "is_automated": true,
      "resolved_at": null,
      "updates": [],
      "created_at": "2026-04-15T12:00:00Z",
      "updated_at": "2026-04-15T12:00:00Z"
    }
  ]
}
```

## Get Incident

```
GET /incidents/:id
```

Returns a single incident with its updates and associated monitor.

## Create Incident

```
POST /incidents
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `monitor_id` | string | Yes | UUID of the associated monitor |
| `title` | string | Yes | Incident title (max 255 chars) |
| `status` | string | No | `investigating`, `identified`, `monitoring`, `resolved` (default `investigating`) |
| `severity` | string | No | `degraded` or `outage` (default `outage`) |

**Example:**

```bash
curl -X POST https://api.uupsie.com/api/v1/incidents \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "monitor_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Database connectivity issues",
    "severity": "degraded"
  }'
```

## Update Incident

```
PUT /incidents/:id
```

**Parameters:**

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Updated title |
| `status` | string | `investigating`, `identified`, `monitoring`, `resolved` |
| `severity` | string | `degraded` or `outage` |

Setting `status` to `resolved` will automatically set `resolved_at`.

## Delete Incident

```
DELETE /incidents/:id
```

Returns `204 No Content`.

## Post Incident Update

```
POST /incidents/:id/updates
```

Add a status update to an incident. These appear on status pages and are sent to subscribers.

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | Yes | `investigating`, `identified`, `monitoring`, `resolved` |
| `body` | string | Yes | Update message (max 10,000 chars, supports Markdown) |

**Example:**

```bash
curl -X POST https://api.uupsie.com/api/v1/incidents/INCIDENT_ID/updates \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "identified",
    "body": "Root cause identified as a misconfigured database connection pool. Working on a fix."
  }'
```

**Response:**

```json
{
  "data": {
    "id": "...",
    "status": "identified",
    "body": "Root cause identified as a misconfigured database connection pool. Working on a fix.",
    "user": { "id": "...", "name": "Nick Pearson" },
    "created_at": "2026-04-15T12:05:00Z"
  }
}
```
