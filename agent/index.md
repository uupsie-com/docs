# Kubernetes Agent

The Uupsie agent is a lightweight Go binary that runs inside your Kubernetes cluster. It monitors Pods, Deployments, Services, and Nodes in real time and reports their health back to the Uupsie API.

## How It Works

The agent is **outbound-only** — it connects to the Uupsie API over HTTPS and never exposes any inbound ports. This makes it safe to deploy in locked-down environments.

```
┌──────────────────────┐         ┌──────────────────┐
│   Your K8s Cluster   │         │   Uupsie API    │
│                      │         │                  │
│  ┌────────────────┐  │  HTTPS  │                  │
│  │  Uupsie Agent │──┼────────►│  Check Results   │
│  └────────────────┘  │         │  Heartbeats      │
│         │            │         │  Inventory        │
│    watches via       │         │                  │
│    K8s API           │         └──────────────────┘
│         │            │
│  ┌──────▼─────────┐  │
│  │  Pods, Deploys, │  │
│  │  Services, Nodes│  │
│  └────────────────┘  │
└──────────────────────┘
```

### Agent Lifecycle

1. **Starts up** — reads config from environment variables
2. **Heartbeats** — sends a heartbeat to the API every 30 seconds so Uupsie knows the agent is alive
3. **Discovery** — enumerates all namespaces, deployments, pods, services, and nodes in the cluster and reports the inventory to Uupsie
4. **Fetches config** — pulls the list of Kubernetes monitors you've configured from the Uupsie API
5. **Watches resources** — uses Kubernetes informers (real-time event streams) for Pods, Deployments, and Nodes; uses TCP probes for Services
6. **Reports results** — sends check results back to the API as batches
7. **Refreshes config** — periodically re-fetches the monitor list to pick up changes you make in the dashboard

### Cluster Inventory

When the agent starts (and periodically after), it reports your cluster's resources to Uupsie. This powers the resource picker in the dashboard — you can select which Pods, Deployments, Services, and Nodes to monitor from a dropdown rather than typing names manually.

## Next Steps

- [Installation](/agent/installation) — deploy the agent via Helm
- [Configuration](/agent/configuration) — environment variables and tuning
- [Supported Resources](/agent/resources) — what the agent monitors and how
- [Troubleshooting](/agent/troubleshooting) — common issues and fixes
