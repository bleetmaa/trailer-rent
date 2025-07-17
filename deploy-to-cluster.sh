#!/bin/bash

# Trailer Rent - Kubernetes Deployment Script
# Run this script on your k8s-master node

set -e

echo "🚀 Deploying Trailer Rent to Kubernetes Cluster"
echo "================================================"

# Check if kubectl is available
command -v kubectl >/dev/null 2>&1 || { echo "❌ kubectl is required but not installed. Aborting." >&2; exit 1; }

# Check cluster connectivity
echo "📡 Checking cluster connectivity..."
kubectl cluster-info || { echo "❌ Cannot connect to cluster. Aborting." >&2; exit 1; }

echo "✅ Cluster connectivity verified!"

# Install NGINX Ingress Controller if not exists
echo "🔧 Installing NGINX Ingress Controller..."
if ! kubectl get namespace ingress-nginx >/dev/null 2>&1; then
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/baremetal/deploy.yaml
    echo "⏳ Waiting for ingress controller to be ready..."
    kubectl wait --namespace ingress-nginx \
      --for=condition=ready pod \
      --selector=app.kubernetes.io/component=controller \
      --timeout=300s
else
    echo "✅ NGINX Ingress Controller already installed"
fi

# Create namespaces
echo "📁 Creating namespaces..."
kubectl create namespace trailer-rent-dev --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace trailer-rent-qa --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace trailer-rent-prod --dry-run=client -o yaml | kubectl apply -f -

# Create secrets
echo "🔐 Creating secrets..."
POSTGRES_PASSWORD="TrailerRent2025!SecureDB"
JWT_KEY="your-super-secret-jwt-key-that-is-at-least-256-bits-long-for-security-purposes-2025"

for ENV in dev qa prod; do
    echo "Creating secrets for $ENV environment..."
    
    # PostgreSQL secret
    kubectl create secret generic postgres-secret \
        --from-literal=password="$POSTGRES_PASSWORD" \
        --namespace=trailer-rent-$ENV \
        --dry-run=client -o yaml | kubectl apply -f -
    
    # JWT secret
    kubectl create secret generic jwt-secret \
        --from-literal=key="$JWT_KEY" \
        --namespace=trailer-rent-$ENV \
        --dry-run=client -o yaml | kubectl apply -f -
done

# Deploy development environment
echo "🚀 Deploying development environment..."
if [ -d "k8s/environments/dev" ]; then
    kubectl apply -k k8s/environments/dev
else
    echo "❌ Kubernetes manifests not found. Please ensure k8s/environments/dev directory exists."
    exit 1
fi

# Wait for deployments
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/postgres -n trailer-rent-dev
kubectl wait --for=condition=available --timeout=300s deployment/backend -n trailer-rent-dev  
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n trailer-rent-dev

# Get service information
echo "📊 Deployment Status:"
kubectl get pods -n trailer-rent-dev
echo ""
kubectl get services -n trailer-rent-dev
echo ""

# Get ingress information
echo "🌐 Ingress Information:"
kubectl get ingress -n trailer-rent-dev

# Get NodePort for external access
echo "🔗 External Access Information:"
NODEPORT=$(kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath='{.spec.ports[?(@.name=="http")].nodePort}')
NODEPORT_HTTPS=$(kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath='{.spec.ports[?(@.name=="https")].nodePort}')

echo "External access via NodePort:"
echo "HTTP:  http://192.168.1.66:$NODEPORT (redirect to HTTPS)"
echo "HTTPS: https://192.168.1.66:$NODEPORT_HTTPS"
echo ""
echo "Add these to your hosts file for domain access:"
echo "192.168.1.66 dev.trailerrent.se"
echo "192.168.1.66 trailerrent.se"

echo "✅ Deployment completed successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Add DNS entries or update your hosts file"
echo "2. Access the application at https://dev.trailerrent.se:$NODEPORT_HTTPS"
echo "3. Default admin login: admin@trailerrent.se / Admin123!"
