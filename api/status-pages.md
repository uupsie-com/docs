# Status Pages

Status pages display the real-time health of your services. They can be public or password-protected, and support custom domains.

## List Status Pages

```
GET /status-pages
```

## Get Status Page

```
GET /status-pages/:id
```

## Create Status Page

```
POST /status-pages
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Page name (max 255) |
| `slug` | string | Yes | URL slug — the page will be available at `status.uupsie.com/:slug` |
| `monitor_ids` | array | Yes | Array of monitor UUIDs to display |
| `custom_domain` | string | No | Custom domain (e.g. `status.example.com`) |
| `primary_color` | string | No | Hex color for branding (e.g. `#4f46e5`) |
| `custom_css` | string | No | Custom CSS (max 10,000 chars) |
| `header_text` | string | No | Header text or HTML (max 1,000 chars) |
| `footer_text` | string | No | Footer text or HTML (max 1,000 chars) |
| `is_public` | boolean | No | Whether the page is publicly accessible (default `true`) |
| `password` | string | No | Password-protect the page (min 4 chars) |

**Example:**

```bash
curl -X POST https://api.uupsie.com/api/v1/status-pages \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Status",
    "slug": "acme",
    "monitor_ids": ["550e8400-e29b-41d4-a716-446655440000"],
    "primary_color": "#4f46e5",
    "is_public": true
  }'
```

## Update Status Page

```
PUT /status-pages/:id
```

Same parameters as create, all optional.

## Delete Status Page

```
DELETE /status-pages/:id
```

## Custom Domains

To use a custom domain:

1. Set `custom_domain` when creating or updating the status page.
2. Create a CNAME DNS record pointing your domain to `status.uupsie.com`.
3. Trigger domain verification:

```bash
curl -X POST https://api.uupsie.com/api/v1/status-pages/:id/verify-domain \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

TLS certificates are provisioned automatically after verification.

## Upload Logo / Favicon

```
POST /status-pages/:id/logo
POST /status-pages/:id/favicon
```

Send a `multipart/form-data` request with a `file` field. Supported formats: PNG, JPG, SVG. Max size: 2 MB.

```bash
curl -X POST https://api.uupsie.com/api/v1/status-pages/PAGE_ID/logo \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -F "file=@logo.png"
```

To remove:

```
DELETE /status-pages/:id/logo
DELETE /status-pages/:id/favicon
```

## Response

```json
{
  "data": {
    "id": "...",
    "name": "Acme Status",
    "slug": "acme",
    "custom_domain": "status.example.com",
    "domain_verified_at": "2026-04-15T12:00:00Z",
    "domain_verification_status": "verified",
    "logo_url": "https://...",
    "favicon_url": null,
    "primary_color": "#4f46e5",
    "custom_css": null,
    "header_text": null,
    "footer_text": null,
    "is_public": true,
    "has_password": false,
    "monitors_count": 5,
    "subscribers_count": 120,
    "monitors": [...],
    "created_at": "2026-04-01T00:00:00Z",
    "updated_at": "2026-04-15T12:00:00Z"
  }
}
```
