# Installation

The Beacon agent is distributed as a Helm chart and a Docker image.

## Prerequisites

- A Kubernetes cluster (1.26+)
- Helm 3
- A Beacon API token (create one in **Settings → API Tokens**)

## Install with Helm

### From OCI Registry

```bash
helm install beacon-agent oci://ghcr.io/uupsie-com/agent/helm/agent \
  --set apiURL=https://api.uupsie.com \
  --set apiToken=YOUR_API_TOKEN \
  --namespace beacon \
  --create-namespace
```

### From Source

If you've cloned the repository:

```bash
helm install beacon-agent ./helm/agent \
  --set apiURL=https://api.uupsie.com \
  --set apiToken=YOUR_API_TOKEN \
  --namespace beacon \
  --create-namespace
```

## What Gets Created

The Helm chart creates these resources in the `beacon` namespace:

| Resource | Name | Purpose |
|----------|------|---------|
| Deployment | `beacon-agent` | Runs the agent (1 replica) |
| ServiceAccount | `beacon-agent` | Identity for the agent pod |
| ClusterRole | `beacon-agent` | Read-only access to cluster resources |
| ClusterRoleBinding | `beacon-agent` | Binds the role to the service account |
| Secret | `beacon-agent` | Stores the API token |

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
kubectl -n beacon get pods
```

Check the logs:

```bash
kubectl -n beacon logs -l app=beacon-agent
```

You should see:

```
starting beacon agent...
connected to https://api.uupsie.com
reported cluster inventory: 5 namespaces, 23 resources
fetched 3 monitors from config
watching resources...
```

## Upgrade

```bash
helm upgrade beacon-agent oci://ghcr.io/uupsie-com/agent/helm/agent \
  --namespace beacon \
  --reuse-values
```

## Uninstall

```bash
helm uninstall beacon-agent --namespace beacon
```
