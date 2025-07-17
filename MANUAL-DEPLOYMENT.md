# Manual Deployment Guide

Since GitHub Actions runners cannot access your local Kubernetes cluster directly, this guide provides manual deployment steps.

## 🚀 Quick Deployment Steps

### 1. Check GitHub Actions Status

First, ensure the build and push jobs completed successfully:
- Go to: https://github.com/bleetmaa/trailer-rent/actions
- Verify ✅ `build-and-push-backend` and ✅ `build-and-push-frontend` completed

### 2. Deploy to Your Cluster

Run these commands on your **k8s-master**:

```bash
# Clone/update repository (if not already done)
git clone https://github.com/bleetmaa/trailer-rent.git
cd trailer-rent

# Or update existing repo
git pull origin main

# Setup cluster infrastructure (one-time)
./setup-cluster.sh

# Deploy development environment
kubectl apply -k k8s/environments/dev

# Deploy production environment (optional)
kubectl apply -k k8s/environments/prod
```

### 3. Verify Deployment

```bash
# Check pod status
kubectl get pods -n trailer-rent-dev
kubectl get pods -n trailer-rent-prod

# Check services
kubectl get svc -n trailer-rent-dev
kubectl get ingress -n trailer-rent-dev

# Check ingress controller
kubectl get svc ingress-nginx-controller -n ingress-nginx
```

## 🔧 Cluster Setup Script

Create this script on your k8s-master as `setup-cluster.sh`:

```bash
#!/bin/bash

echo "🔧 Setting up Trailer Rent cluster infrastructure..."

# Install NGINX Ingress Controller if not exists
if ! kubectl get namespace ingress-nginx >/dev/null 2>&1; then
    echo "Installing NGINX Ingress Controller..."
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/baremetal/deploy.yaml
    kubectl wait --namespace ingress-nginx \
      --for=condition=ready pod \
      --selector=app.kubernetes.io/component=controller \
      --timeout=300s
fi

# Create namespaces
kubectl create namespace trailer-rent-dev --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace trailer-rent-qa --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace trailer-rent-prod --dry-run=client -o yaml | kubectl apply -f -

# Create secrets
POSTGRES_PASSWORD="TrailerRent2025!SecureDB"
JWT_KEY="your-super-secret-jwt-key-that-is-at-least-256-bits-long-for-security-purposes-2025"

for ENV in dev qa prod; do
    echo "Creating secrets for $ENV environment..."
    
    kubectl create secret generic postgres-secret \
        --from-literal=password="$POSTGRES_PASSWORD" \
        --namespace=trailer-rent-$ENV \
        --dry-run=client -o yaml | kubectl apply -f -
    
    kubectl create secret generic jwt-secret \
        --from-literal=key="$JWT_KEY" \
        --namespace=trailer-rent-$ENV \
        --dry-run=client -o yaml | kubectl apply -f -
done

echo "✅ Cluster setup completed!"
```

## 🔄 Update Deployment

When you push new code:

1. **Wait for GitHub Actions** to build and push new images
2. **Update deployments** on k8s-master:
   ```bash
   cd trailer-rent
   git pull origin main
   kubectl apply -k k8s/environments/dev
   kubectl rollout restart deployment/backend deployment/frontend -n trailer-rent-dev
   ```

## 📊 Monitoring

### Check Application Status
```bash
# View all resources
kubectl get all -n trailer-rent-dev

# Check logs
kubectl logs -l app=backend -n trailer-rent-dev
kubectl logs -l app=frontend -n trailer-rent-dev
kubectl logs -l app=postgres -n trailer-rent-dev
```

### Access Application
```bash
# Get NodePort
kubectl get svc ingress-nginx-controller -n ingress-nginx

# Access via:
# https://192.168.1.66:NODEPORT_HTTPS (direct IP)
# https://trailerrent.se (after DNS/port forwarding setup)
```

## 🆘 Troubleshooting

### Pods Not Starting
```bash
kubectl describe pod POD_NAME -n trailer-rent-dev
kubectl logs POD_NAME -n trailer-rent-dev
```

### Image Pull Issues
```bash
# Check if images exist in registry
docker pull ghcr.io/bleetmaa/trailer-rent-backend:latest
docker pull ghcr.io/bleetmaa/trailer-rent-frontend:latest
```

### Database Issues
```bash
kubectl logs -l app=postgres -n trailer-rent-dev
kubectl exec -it POD_NAME -n trailer-rent-dev -- psql -U trailerrent -d trailerrent
```

This manual approach gives you full control over your deployments while maintaining the benefits of automated building and testing! 🚀
