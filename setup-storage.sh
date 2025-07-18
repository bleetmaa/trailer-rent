#!/bin/bash

# Setup Local Storage for PostgreSQL on Rock 5 SE Cluster

echo "🗄️ Setting up local storage for PostgreSQL..."

# Create storage directory on worker node
echo "Creating storage directory on worker node..."
ssh root@192.168.1.67 "mkdir -p /mnt/kubernetes-storage/postgres && chmod 777 /mnt/kubernetes-storage/postgres"

# Apply storage configuration
echo "Applying storage configuration..."
kubectl apply -f k8s/storage-setup.yaml

# Check storage class
echo "Checking storage class..."
kubectl get storageclass

# Check persistent volumes
echo "Checking persistent volumes..."
kubectl get pv

echo "✅ Storage setup complete!"
echo ""
echo "Now you can deploy PostgreSQL with persistent storage:"
echo "kubectl apply -k k8s/environments/prod"
