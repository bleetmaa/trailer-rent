# Self-Hosted GitHub Runner Setup Guide

This guide helps you set up a self-hosted GitHub Actions runner that can deploy to your local Kubernetes cluster.

## 📋 Prerequisites

- A Linux machine on your local network (can be the k8s-master or another machine)
- Docker installed
- kubectl configured to access your cluster

## 🚀 Setup Self-Hosted Runner

### 1. Navigate to GitHub Repository Settings

1. Go to your repository: https://github.com/bleetmaa/trailer-rent
2. Click **Settings** → **Actions** → **Runners**
3. Click **"New self-hosted runner"**
4. Select **Linux** as the operating system

### 2. Run Setup Commands on Your k8s-master

GitHub will provide you with commands like these (use the actual ones from your repo):

```bash
# Create a folder for the runner
mkdir actions-runner && cd actions-runner

# Download the latest runner package
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# Extract the installer
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configure the runner
./config.sh --url https://github.com/bleetmaa/trailer-rent --token [YOUR_TOKEN]

# Install as a service
sudo ./svc.sh install

# Start the service
sudo ./svc.sh start
```

### 3. Update GitHub Actions Workflow

Update `.github/workflows/ci-cd.yml` to use your self-hosted runner:

```yaml
deploy-dev:
  needs: [build-and-push-backend, build-and-push-frontend]
  runs-on: self-hosted  # Changed from ubuntu-latest
  if: github.ref == 'refs/heads/develop'
  environment: dev
  steps:
  - name: Checkout repository
    uses: actions/checkout@v4
    
  - name: Deploy to Dev
    run: |
      kubectl apply -k k8s/environments/dev
      kubectl rollout restart deployment/backend deployment/frontend -n trailer-rent-dev

deploy-prod:
  needs: [build-and-push-backend, build-and-push-frontend]  
  runs-on: self-hosted  # Changed from ubuntu-latest
  if: github.ref == 'refs/heads/main'
  environment: production
  steps:
  - name: Checkout repository
    uses: actions/checkout@v4
    
  - name: Deploy to Production
    run: |
      kubectl apply -k k8s/environments/prod
      kubectl rollout restart deployment/backend deployment/frontend -n trailer-rent-prod
```

## ✅ Benefits

- Direct access to your local cluster
- No network connectivity issues
- Full control over deployment environment
- Can run additional local tools and scripts

## 🔧 Alternative: Manual Deployment

If you prefer not to set up a self-hosted runner, you can deploy manually:

```bash
# On your k8s-master, pull the latest images and deploy
kubectl apply -k k8s/environments/dev
kubectl rollout restart deployment/backend deployment/frontend -n trailer-rent-dev
```
