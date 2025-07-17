# Manual Deployment Guide

## Prerequisites
- kubectl configured with your cluster (already done)
- Docker images built and pushed to registry

## Build and Push Images Locally

```bash
# Build and tag backend image
cd src/backend
docker build -t ghcr.io/bleetmaa/trailer-rent-backend:latest .
docker push ghcr.io/bleetmaa/trailer-rent-backend:latest

# Build and tag frontend image
cd ../frontend/trailer-rent-app
docker build -t ghcr.io/bleetmaa/trailer-rent-frontend:latest .
docker push ghcr.io/bleetmaa/trailer-rent-frontend:latest
```

## Deploy to Development Environment

```bash
# Create namespace
kubectl create namespace trailer-rent-dev --dry-run=client -o yaml | kubectl apply -f -

# Create secrets (replace with your actual values)
kubectl create secret generic postgres-secret \
  --from-literal=password="your_postgres_password" \
  --namespace=trailer-rent-dev \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic jwt-secret \
  --from-literal=key="your_jwt_secret_key" \
  --namespace=trailer-rent-dev \
  --dry-run=client -o yaml | kubectl apply -f -

# Update image tags in kustomization
cd k8s/environments/dev
kustomize edit set image frontend-image=ghcr.io/bleetmaa/trailer-rent-frontend:latest
kustomize edit set image backend-image=ghcr.io/bleetmaa/trailer-rent-backend:latest

# Deploy
kubectl apply -k k8s/environments/dev

# Check deployment status
kubectl get pods -n trailer-rent-dev
kubectl get services -n trailer-rent-dev
kubectl get ingress -n trailer-rent-dev
```

## Access the Application

After deployment, you can access:
- Development: http://trailer-rent-dev.local.leetmaa.com
- Or via NodePort: http://192.168.1.66:31720

## Troubleshooting

```bash
# Check pod logs
kubectl logs -n trailer-rent-dev deployment/backend
kubectl logs -n trailer-rent-dev deployment/frontend

# Check service endpoints
kubectl get endpoints -n trailer-rent-dev

# Check ingress status
kubectl describe ingress -n trailer-rent-dev
```
