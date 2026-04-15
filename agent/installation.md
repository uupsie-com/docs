# Installation

The Uupsie agent is distributed as a Helm chart and a Docker image.

## Prerequisites

- A Kubernetes cluster (1.26+)
- Helm 3
- An Uupsie API token (create one in **Settings → API Tokens**)

## Install with Helm

### From OCI Registry

```bash
helm install uupsie-agent oci://ghcr.io/uupsie-com/agent/helm/agent \
  --set apiURL=https://api.uupsie.com \
  --set apiToken=YOUR_API_TOKEN \
  --namespace uupsie \
  --create-namespace
```

### From Source

If you've cloned the repository:

```bash
helm install uupsie-agent ./helm/agent \
  --set apiURL=https://api.uupsie.com \
  --set apiToken=YOUR_API_TOKEN \
  --namespace uupsie \
  --create-namespace
```

## What Gets Created

The Helm chart creates these resources in the `uupsie` namespace:

| Resource | Name | Purpose |
|----------|------|---------|
| Deployment | `uupsie-agent` | Runs the agent (1 replica) |
| ServiceAccount | `uupsie-agent` | Identity for the agent pod |
| ClusterRole | `uupsie-agent` | Read-only access to cluster resources |
| ClusterRoleBinding | `uupsie-agent` | Binds the role to the service account |
| Secret | `uupsie-agent` | Stores the API token |

### RBAC Permissions

The agent requires **read-only** cluster-wide access:

| API Group | Resources | Verbs |
|-----------|-----------|-------|
| `""` (core) | `namespaces`, `pods`, `services`, `nodes`, `endpoints` | `get`, `list`, `watch` |
| `apps` | `deployments` | `get`, `list`, `watch` |

The agent never modifies any resources in your cluster.

## Verify Installation

Check the agent is running:

```bash
kubectl -n uupsie get pods
```

Check the logs:

```bash
kubectl -n uupsie logs -l app=uupsie-agent
```

You should see:

```
starting uupsie agent...
connected to https://api.uupsie.com
reported cluster inventory: 5 namespaces, 23 resources
fetched 3 monitors from config
watching resources...
```

## Upgrade

```bash
helm upgrade uupsie-agent oci://ghcr.io/uupsie-com/agent/helm/agent \
  --namespace uupsie \
  --reuse-values
```

## Uninstall

```bash
helm uninstall uupsie-agent --namespace uupsie
```
