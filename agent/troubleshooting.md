# Troubleshooting

## Agent Not Starting

**Check the pod status:**

```bash
kubectl -n uupsie get pods
kubectl -n uupsie describe pod -l app=uupsie-agent
```

**Common causes:**
- `ImagePullBackOff` — the image can't be pulled. Check `image.repository` and `image.tag` in your Helm values, and ensure your cluster can reach `ghcr.io`.
- `CrashLoopBackOff` — the agent is crashing. Check the logs.

## Agent Crashes on Startup

```bash
kubectl -n uupsie logs -l app=uupsie-agent
```

| Error | Cause | Fix |
|-------|-------|-----|
| `AGENT_API_URL is required` | Missing API URL | Set `apiURL` in Helm values |
| `AGENT_API_TOKEN is required` | Missing API token | Set `apiToken` in Helm values |
| `401 Unauthorized` | Invalid or revoked token | Generate a new token in **Settings → API Tokens** |

## No Resources Showing in Dashboard

If the agent is running but the resource picker in the dashboard is empty:

1. **Check RBAC** — ensure the ClusterRole and ClusterRoleBinding exist:

   ```bash
   kubectl get clusterrole uupsie-agent
   kubectl get clusterrolebinding uupsie-agent
   ```

2. **Check inventory logs** — look for inventory reporting in the agent logs:

   ```bash
   kubectl -n uupsie logs -l app=uupsie-agent | grep inventory
   ```

3. **Verify the token** — the API token must belong to the same organization where you're trying to create monitors.

## Monitors Stuck on "Unknown"

Kubernetes monitors show "unknown" status until the agent reports its first check result. This usually happens within 30–60 seconds of creating the monitor.

If it persists:

- **Agent not running** — check `kubectl -n uupsie get pods`
- **Config not refreshed** — the agent fetches its monitor list on an interval. Wait for the config refresh (default: 60 seconds), or restart the agent pod:

  ```bash
  kubectl -n uupsie rollout restart deployment uupsie-agent
  ```

- **Resource not found** — the agent can only monitor resources that exist in the cluster. Verify the namespace and resource name match exactly.

## Service Monitor Always Down

Service monitors use TCP probes from inside the cluster. If a service monitor is always reporting down:

1. **Check the port** — the `port` in the monitor config must match the port your service is listening on (not the NodePort or external port).
2. **Check ClusterIP** — ensure the service has a ClusterIP assigned:

   ```bash
   kubectl -n NAMESPACE get svc SERVICE_NAME
   ```

3. **Test from inside the cluster:**

   ```bash
   kubectl run debug --rm -it --image=busybox -- nc -zv SERVICE_NAME.NAMESPACE.svc.cluster.local PORT
   ```

## High Memory Usage

If the agent is using more memory than expected, it's likely watching a large number of namespaces. The agent creates informers per namespace, each of which caches resource state in memory.

For very large clusters, increase the memory limit:

```bash
helm upgrade uupsie-agent oci://ghcr.io/uupsie-com/agent/helm/agent \
  --namespace uupsie \
  --set resources.limits.memory=512Mi \
  --reuse-values
```

## Getting Help

If you're still stuck, reach out at [support@uupsie.com](mailto:support@uupsie.com) with:

- Agent logs (`kubectl -n uupsie logs -l app=uupsie-agent`)
- Kubernetes version (`kubectl version`)
- Helm values (redact your API token)
