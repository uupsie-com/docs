# Configuration

The agent is configured via environment variables, set through Helm values.

## Helm Values

| Value | Default | Description |
|-------|---------|-------------|
| `apiURL` | — | **(Required)** Beacon API base URL |
| `apiToken` | — | **(Required)** Beacon API token |
| `configRefreshInterval` | `60s` | How often to re-fetch the monitor list from the API |
| `image.repository` | `ghcr.io/uupsie-com/agent` | Docker image repository |
| `image.tag` | `latest` | Docker image tag |
| `image.pullPolicy` | `IfNotPresent` | Image pull policy |
| `resources.requests.cpu` | `50m` | CPU request |
| `resources.requests.memory` | `64Mi` | Memory request |
| `resources.limits.cpu` | `200m` | CPU limit |
| `resources.limits.memory` | `128Mi` | Memory limit |

## Environment Variables

These are set automatically by the Helm chart, but documented here for reference if deploying manually:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AGENT_API_URL` | Yes | — | Beacon API base URL (e.g. `https://api.uupsie.com`) |
| `AGENT_API_TOKEN` | Yes | — | Sanctum API token |
| `AGENT_CONFIG_INTERVAL` | No | `5m` | Config refresh interval (Go duration string: `30s`, `5m`, `1h`) |

## Custom Values File

For production, create a `values.yaml`:

```yaml
apiURL: https://api.uupsie.com
apiToken: your-api-token-here

configRefreshInterval: "30s"

resources:
  requests:
    cpu: 100m
    memory: 64Mi
  limits:
    cpu: 500m
    memory: 256Mi
```

Then install with:

```bash
helm install beacon-agent oci://ghcr.io/uupsie-com/agent/helm/agent \
  -f values.yaml \
  --namespace beacon \
  --create-namespace
```

::: tip
For secrets management, consider using a tool like [External Secrets](https://external-secrets.io/) or [Sealed Secrets](https://sealed-secrets.netlify.app/) to inject the API token rather than storing it in plain text.
:::

## Resource Usage

The agent is lightweight. In a typical cluster (< 100 monitored resources), expect:

- **CPU**: ~10m idle, ~50m under load
- **Memory**: ~30–60 MB
- **Network**: Minimal — small JSON payloads every 30–60 seconds
