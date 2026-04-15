# API Reference

Base URL: `https://api.uupsie.com/api/v1`

All requests require an `Authorization: Bearer <token>` header unless noted otherwise. Request and response bodies use JSON.

## Resources

| Resource | Description |
|----------|-------------|
| [Monitors](/api/monitors) | Create and manage uptime monitors (HTTP, TCP, Ping, DNS, Kubernetes) |
| [Incidents](/api/incidents) | Track and manage incidents tied to monitors |
| [Status Pages](/api/status-pages) | Public and private status pages for your services |
| [Notification Channels](/api/notification-channels) | Email, Slack, and PagerDuty alert channels |
| [Webhooks](/api/webhooks) | HTTP callbacks for monitor and incident events |
| [Maintenance Windows](/api/maintenance-windows) | Schedule planned maintenance to suppress alerts |
| [Team & Roles](/api/team) | Manage team members, roles, and invitations |
| [API Tokens](/api/tokens) | Create and revoke API tokens |

## Common Patterns

### IDs

All resources use UUIDs as identifiers.

### Timestamps

All timestamps are returned in ISO 8601 format: `2026-04-15T12:00:00Z`.

### Filtering & Pagination

List endpoints accept `page` and `per_page` query parameters. Some endpoints support additional filters documented on their respective pages.
