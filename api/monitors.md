# Monitors

Monitors are the core of Beacon. They periodically check the health of your services and report status changes.

## Monitor Types

| Type | Description |
|------|-------------|
| `http` | HTTP/HTTPS endpoint check |
| `tcp` | TCP port connectivity check |
| `ping` | ICMP ping check |
| `dns` | DNS resolution check |
| `k8s_pod` | Kubernetes Pod health (requires [agent](/agent/)) |
| `k8s_deployment` | Kubernetes Deployment health (requires [agent](/agent/)) |
| `k8s_service` | Kubernetes Service TCP probe (requires [agent](/agent/)) |
| `k8s_node` | Kubernetes Node health (requires [agent](/agent/)) |

## List Monitors

```
GET /monitors
```

Returns a paginated list of all monitors in your organization.

**Response:**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Production API",
      "type": "http",
      "config": {
        "url": "https://api.example.com/health",
        "method": "GET",
        "expected_status": 200
      },
      "interval_seconds": 60,
      "timeout_seconds": 30,
      "failure_threshold": 3,
      "recovery_threshold": 2,
      "status": "up",
      "is_paused": false,
      "last_checked_at": "2026-04-15T12:00:00Z",
      "created_at": "2026-04-01T00:00:00Z",
      "updated_at": "2026-04-15T12:00:00Z"
    }
  ]
}
```

## Get Monitor

```
GET /monitors/:id
```

Returns a single monitor with its latest check and recent incidents.

## Create Monitor

```
POST /monitors
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Display name (max 255 chars) |
| `type` | string | Yes | One of: `http`, `tcp`, `ping`, `dns`, `k8s_pod`, `k8s_deployment`, `k8s_service`, `k8s_node` |
| `config` | object | Yes | Type-specific configuration (see below) |
| `interval_seconds` | integer | No | Check interval. Allowed: `30`, `60`, `120`, `300`, `600`, `900`, `1800`, `3600`. Minimum is enforced by your plan. |
| `timeout_seconds` | integer | No | Timeout per check (1–120, default 30) |
| `failure_threshold` | integer | No | Consecutive failures before marking down (1–10, default 3) |
| `recovery_threshold` | integer | No | Consecutive successes before marking up (1–10, default 2) |
| `is_paused` | boolean | No | Pause the monitor (default false) |

### HTTP Config

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `config.url` | string | Yes | URL to check (max 2048 chars) |
| `config.method` | string | No | HTTP method: `GET`, `HEAD`, `POST`, `PUT`, `DELETE` (default `GET`) |
| `config.expected_status` | integer | No | Expected HTTP status code (100–599) |
| `config.body_contains` | string | No | Assert response body contains this string (max 1000 chars) |
| `config.headers` | object | No | Custom headers as key-value pairs |

### TCP Config

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `config.host` | string | Yes | Hostname or IP |
| `config.port` | integer | Yes | Port number (1–65535) |

### Ping Config

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `config.host` | string | Yes | Hostname or IP |

### DNS Config

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `config.host` | string | Yes | Domain name to resolve |

### Kubernetes Config

For `k8s_pod`, `k8s_deployment`, `k8s_service`, and `k8s_node` types:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `config.namespace` | string | No | Kubernetes namespace (not used for `k8s_node`) |
| `config.name` | string | No | Resource name |
| `config.port` | integer | For `k8s_service` | Service port to probe (1–65535) |

::: tip
Kubernetes monitors require the [Beacon agent](/agent/) running in your cluster. The agent watches the resources and reports status to the API.
:::

**Example — HTTP monitor:**

```bash
curl -X POST https://api.uupsie.com/api/v1/monitors \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production API",
    "type": "http",
    "config": {
      "url": "https://api.example.com/health",
      "method": "GET",
      "expected_status": 200
    },
    "interval_seconds": 60,
    "failure_threshold": 3
  }'
```

**Example — Kubernetes Deployment monitor:**

```bash
curl -X POST https://api.uupsie.com/api/v1/monitors \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Deployment",
    "type": "k8s_deployment",
    "config": {
      "namespace": "production",
      "name": "api"
    },
    "interval_seconds": 60
  }'
```

## Update Monitor

```
PUT /monitors/:id
```

Accepts the same parameters as create. All fields are optional — only include fields you want to change.

## Delete Monitor

```
DELETE /monitors/:id
```

Returns `204 No Content`.

## Get Check History

```
GET /monitors/:id/checks
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `period` | string | Time range: `24h`, `7d`, `30d`, `90d` (default `24h`) |
| `status` | string | Filter by status: `up`, `down`, `degraded` |
| `page` | integer | Page number |
| `per_page` | integer | Results per page (max 100) |

**Response:**

```json
{
  "data": [
    {
      "id": "...",
      "status": "up",
      "response_time_ms": 142,
      "status_code": 200,
      "error_message": null,
      "metadata": {},
      "checked_at": "2026-04-15T12:00:00Z"
    }
  ],
  "meta": { "current_page": 1, "per_page": 50, "total": 1000, "last_page": 20 }
}
```

## Get Metrics

```
GET /monitors/:id/metrics
```

Returns aggregated uptime and response time metrics.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `period` | string | `24h`, `7d`, `30d`, `90d` (default `24h`) |

Data is bucketed by time interval: 5 min (24h), 1 hour (7d), 6 hours (30d), 1 day (90d).

**Response:**

```json
{
  "summary": {
    "uptime_pct": 99.95,
    "avg_response_time": 142,
    "p95_response_time": 250,
    "p99_response_time": 380,
    "min_response_time": 45,
    "max_response_time": 1200,
    "total_checks": 5000,
    "down_checks": 3,
    "degraded_checks": 2,
    "incidents_count": 1
  },
  "series": [
    {
      "bucket": "2026-04-15T12:00:00Z",
      "total_checks": 12,
      "up_checks": 12,
      "uptime_pct": 100.0,
      "avg_response_time": 140,
      "p95_response_time": 200,
      "min_response_time": 90,
      "max_response_time": 210
    }
  ]
}
```
