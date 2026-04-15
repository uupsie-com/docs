# Getting Started

Uupsie is an uptime monitoring platform with built-in status pages and Kubernetes observability.

## Creating an Account

Sign up at [app.uupsie.com](https://app.uupsie.com) and create your organization. After selecting a plan, you'll have access to the dashboard and the API.

## Creating an API Token

To use the API, generate a token from **Settings → API Tokens** in the dashboard. Tokens are scoped to your organization and grant full access to all resources.

Store your token securely — it is only shown once at creation time.

## Base URL

All API requests use the following base URL:

```
https://api.uupsie.com/api/v1
```

## Your First API Call

```bash
curl https://api.uupsie.com/api/v1/monitors \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

## Next Steps

- [Authentication](/guide/authentication) — how auth works in detail
- [API Reference](/api/) — full endpoint documentation
- [Kubernetes Agent](/agent/) — deploy monitoring into your cluster
