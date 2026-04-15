# Authentication

All authenticated API requests require a Bearer token in the `Authorization` header.

## API Tokens

Generate tokens from **Settings → API Tokens** in the dashboard, or via the API:

```bash
curl -X POST https://api.uupsie.com/api/v1/tokens \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "CI/CD Token"}'
```

The response includes `plain_text_token` — this is the only time the full token is shown.

## Using Your Token

Include the token in every request:

```bash
curl https://api.uupsie.com/api/v1/monitors \
  -H "Authorization: Bearer 1|abc123def456..."
```

## Token Scope

Tokens inherit the permissions of the user who created them and are scoped to the user's organization. All resources returned are filtered to the organization the token belongs to.

## Revoking Tokens

Delete a token to immediately revoke access:

```bash
curl -X DELETE https://api.uupsie.com/api/v1/tokens/1 \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```
