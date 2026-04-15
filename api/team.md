# Team & Roles

Manage your organization's members, roles, and invitations.

## Team Members

### List Members

```
GET /team/members
```

### Update Member Role

```
PUT /team/members/:user_id
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `role_id` | string | Yes | UUID of the role to assign |

### Remove Member

```
DELETE /team/members/:user_id
```

## Invitations

### List Invitations

```
GET /team/invitations
```

### Send Invitation

```
POST /team/invitations
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Email address to invite |
| `role_id` | string | Yes | UUID of the role to assign |

**Example:**

```bash
curl -X POST https://api.uupsie.com/api/v1/team/invitations \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "colleague@example.com",
    "role_id": "ROLE_UUID"
  }'
```

### Cancel Invitation

```
DELETE /team/invitations/:id
```

## Roles

Roles control what actions team members can perform.

### List Roles

```
GET /roles
```

### List Available Permissions

```
GET /roles/permissions
```

Returns all permission strings that can be assigned to roles.

### Get Role

```
GET /roles/:id
```

### Create Role

```
POST /roles
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Role name (max 255, unique per organization) |
| `permissions` | array | Yes | Array of permission strings |
| `is_default` | boolean | No | Set as the default role for new members |

**Example:**

```bash
curl -X POST https://api.uupsie.com/api/v1/roles \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Viewer",
    "permissions": ["monitors.view", "incidents.view"],
    "is_default": false
  }'
```

### Update Role

```
PUT /roles/:id
```

### Delete Role

```
DELETE /roles/:id
```

::: warning
System roles cannot be modified or deleted. You can only create custom roles via the API.
:::
