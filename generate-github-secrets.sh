#!/bin/bash

# Generate KUBE_CONFIG for GitHub Actions
# This script helps you create the KUBE_CONFIG secret for GitHub Actions to deploy to your private cluster

echo "🔧 Generating KUBE_CONFIG for GitHub Actions"
echo "=============================================="

# Check if kubectl is available
command -v kubectl >/dev/null 2>&1 || { echo "❌ kubectl is required but not installed. Aborting." >&2; exit 1; }

# Get current context
CURRENT_CONTEXT=$(kubectl config current-context)
echo "Current context: $CURRENT_CONTEXT"

# Get cluster name from current context
CLUSTER_NAME=$(kubectl config view --minify -o jsonpath='{.contexts[0].context.cluster}')
echo "Cluster name: $CLUSTER_NAME"

# Get current cluster server
CURRENT_SERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
echo "Current server: $CURRENT_SERVER"

echo ""
echo "📝 For GitHub Actions to work with your private cluster, you have two options:"
echo ""

echo "Option 1: Use existing config (if you have VPN/tunnel to your cluster)"
echo "======================================================================="
echo "If GitHub Actions can reach $CURRENT_SERVER directly:"
echo ""
kubectl config view --raw --minify | base64 -w 0
echo ""
echo ""

echo "Option 2: Modify config for public access (recommended)"
echo "========================================================"
echo "If you need to use a public IP/domain:"
echo ""
echo "1. What is your public/external IP or domain? (e.g., your.domain.com:6443)"
read -p "Enter your public Kubernetes API endpoint: " PUBLIC_ENDPOINT

if [ ! -z "$PUBLIC_ENDPOINT" ]; then
    # Create a temporary kubeconfig with the public endpoint
    kubectl config view --raw --minify > /tmp/kubeconfig-github.yaml
    
    # Replace the server URL
    sed -i "s|server: .*|server: https://$PUBLIC_ENDPOINT|g" /tmp/kubeconfig-github.yaml
    
    echo ""
    echo "🔑 Use this as your KUBE_CONFIG secret in GitHub:"
    echo "=================================================="
    cat /tmp/kubeconfig-github.yaml | base64 -w 0
    echo ""
    echo ""
    
    echo "🌐 Also set these GitHub secrets:"
    echo "================================="
    echo "KUBERNETES_PUBLIC_IP=$(echo $PUBLIC_ENDPOINT | cut -d: -f1)"
    echo ""
    
    # Clean up
    rm /tmp/kubeconfig-github.yaml
fi

echo "🔒 Don't forget to also set these secrets in GitHub:"
echo "===================================================="
echo "POSTGRES_PASSWORD=TrailerRent2025!SecureDB"
echo "JWT_SECRET_KEY=your-super-secret-jwt-key-that-is-at-least-256-bits-long-for-security-purposes-2025"
echo ""

echo "✅ After setting these secrets, your GitHub Actions should be able to deploy to your cluster!"
