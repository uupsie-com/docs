# Supported Resources

The Beacon agent monitors four types of Kubernetes resources. Each uses a different detection mechanism and health evaluation logic.

## Pods

**Monitor type:** `k8s_pod`

The agent watches Pods via Kubernetes informers (real-time event stream). Health is evaluated on every change event.

| Pod State | Beacon Status | Notes |
|-----------|--------------|-------|
| `Running`, all containers ready | `up` | Healthy |
| `Running`, any container not ready | `down` | Reports which container is not ready |
| `Succeeded` | `up` | Completed successfully (e.g. Job pods) |
| `Pending` | `degraded` | Pod is waiting to be scheduled or pulling images |
| `Failed` / `Unknown` | `down` | |
| Deleted | `down` | "pod deleted" |

**Example config:**

```json
{
  "namespace": "production",
  "name": "api-server-abc123"
}
```

::: tip
For most use cases, monitoring the **Deployment** is more useful than individual Pods since pod names change on every restart.
:::

## Deployments

**Monitor type:** `k8s_deployment`

Watched via Kubernetes informers. Health is based on the ratio of available replicas to desired replicas.

| Condition | Beacon Status | Notes |
|-----------|--------------|-------|
| `available >= desired` | `up` | All replicas running |
| `0 < available < desired` | `degraded` | Partial availability (e.g. "2/3 replicas available") |
| `available == 0` | `down` | No replicas running |
| Deleted | `down` | "deployment deleted" |

**Example config:**

```json
{
  "namespace": "production",
  "name": "api"
}
```

This is the most common Kubernetes monitor type. It tracks rolling updates, scale-downs, and crash loops automatically.

## Services

**Monitor type:** `k8s_service`

Services are monitored with **active TCP probes** rather than informers. The agent periodically connects to the service's ClusterIP on the specified port.

| Condition | Beacon Status | Notes |
|-----------|--------------|-------|
| TCP connection succeeds | `up` | Reports response time |
| TCP connection fails | `down` | Reports error message and response time |

The agent also reports endpoint readiness as metadata:

```json
{
  "ready_endpoints": 3,
  "total_endpoints": 3
}
```

**Resolution order:**
1. ClusterIP from the Kubernetes API
2. DNS fallback: `<name>.<namespace>.svc.cluster.local`

**Example config:**

```json
{
  "namespace": "production",
  "name": "api",
  "port": 8080
}
```

::: info
The `port` field is required for Service monitors. It should be the port your service is listening on inside the cluster.
:::

## Nodes

**Monitor type:** `k8s_node`

Watched via Kubernetes informers. Health is based on the `NodeReady` condition.

| Condition | Beacon Status | Notes |
|-----------|--------------|-------|
| `NodeReady` is `True` | `up` | Node is healthy |
| `NodeReady` is not `True` | `down` | Reports the condition message |
| No `NodeReady` condition | `down` | "node ready condition not found" |
| Deleted | `down` | "node removed from cluster" |

**Example config:**

```json
{
  "name": "ip-10-0-1-42.ec2.internal"
}
```

Nodes don't have a namespace — only the `name` field is used.

## Comparison

| Feature | Pods | Deployments | Services | Nodes |
|---------|------|-------------|----------|-------|
| Detection | Informer | Informer | TCP probe | Informer |
| Namespace-scoped | Yes | Yes | Yes | No |
| Tracks deletions | Yes | Yes | No | Yes |
| Reports response time | No | No | Yes | No |
| Best for | Specific pods / Jobs | Application health | Connectivity testing | Infrastructure health |
