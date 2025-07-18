# Troubleshooting CrashLoopBackOff Issues

## Current Status Analysis

### 🔍 Issues Identified:

1. **Backend: `exec /usr/bin/dotnet: exec format error`**
   - This suggests a Docker platform/architecture issue
   - Fixed by explicitly setting `platforms: linux/amd64` in GitHub Actions

2. **PostgreSQL: `Pending` state**
   - Database not starting, causing backend connection failures
   - Need to investigate PostgreSQL pod issues

3. **Frontend: CrashLoopBackOff**
   - Likely waiting for backend API to be available

## 🚀 Fixes Applied:

1. **Updated GitHub Actions workflow** with explicit platform targeting
2. **Added Docker Buildx** for better cross-platform builds

## 🔧 Next Steps to Fix:

### 1. Check PostgreSQL Pod Issues
```bash
# Check why postgres is pending
kubectl describe pod postgres-6c78d56785-nddt9 -n trailer-rent-prod

# Check persistent volume claims
kubectl get pvc -n trailer-rent-prod

# Check storage class
kubectl get storageclass
```

### 2. Test the Fix
After GitHub Actions rebuilds with the fixed Dockerfile:
```bash
# Check new pod status
kubectl get pods -n trailer-rent-prod

# Check logs of new backend pods
kubectl logs -f deployment/backend -n trailer-rent-prod
```

### 3. If PostgreSQL Storage Issues
If storage class issues, create a simple hostPath PVC:
```bash
# Apply a local storage fix
kubectl apply -f - <<EOF
apiVersion: v1
kind: PersistentVolume
metadata:
  name: postgres-pv
spec:
  capacity:
    storage: 5Gi
  accessModes:
  - ReadWriteOnce
  hostPath:
    path: /data/postgres
  storageClassName: manual
EOF
```

## ✅ Expected Resolution:
1. PostgreSQL starts successfully
2. Backend connects to database
3. Frontend connects to backend API
4. All pods show `Running` status

The main issue appears to be the Docker image architecture mismatch, which is now fixed in the workflow.
