# GitHub Repository Setup Guide

This guide will help you set up the GitHub repository and configure the automated deployment to your Kubernetes cluster.

## 📋 Prerequisites

- Your Kubernetes cluster is running (✅ You have this)
- kubectl is configured and working (✅ You have this)
- GitHub account and repository created

## 🚀 Step-by-Step Setup

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `trailer-rent`
3. Make it **public** (required for GitHub Container Registry)
4. Don't initialize with README (we already have files)

### 2. Push Code to GitHub

Run these commands from your Windows machine in the project directory:

```powershell
# Add remote origin (replace 'bleetmaa' with your GitHub username if different)
git remote add origin https://github.com/bleetmaa/trailer-rent.git

# Push main branch
git push -u origin main

# Create and push develop branch
git checkout -b develop
git push -u origin develop
git checkout main
```

### 3. Configure GitHub Repository Secrets

Go to your repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these 4 secrets:

#### KUBE_CONFIG
```bash
# On your k8s-master, run this command:
kubectl config view --raw --minify | base64 -w 0

# Copy the output and paste it as the KUBE_CONFIG secret value
```

#### POSTGRES_PASSWORD
```
TrailerRent2025!SecureDB
```

#### JWT_SECRET_KEY
```
your-super-secret-jwt-key-that-is-at-least-256-bits-long-for-security-purposes-2025
```

#### KUBERNETES_PUBLIC_IP
```
192.168.1.66
```

### 4. Enable GitHub Actions

1. Go to your repository → **Actions** tab
2. Click **"I understand my workflows, go ahead and enable them"**
3. GitHub Actions will automatically trigger on the next push

### 5. Test Deployment

```powershell
# Make a small change to trigger deployment
echo "# Deployment test" >> README.md
git add README.md
git commit -m "Test GitHub Actions deployment"
git push origin main
```

### 6. Monitor Deployment

1. Go to **Actions** tab in your GitHub repository
2. Click on the running workflow to see progress
3. The workflow will:
   - Install NGINX Ingress Controller (if not already installed)
   - Create namespaces and secrets
   - Build and push Docker images
   - Deploy to your cluster

### 7. Access Your Application

After successful deployment:

#### Get the NodePort:
```bash
# On k8s-master:
kubectl get svc ingress-nginx-controller -n ingress-nginx
```

#### Add to your Windows hosts file:
```
# Edit C:\Windows\System32\drivers\etc\hosts (as Administrator)
192.168.1.66 dev.trailerrent.se
192.168.1.66 trailerrent.se
```

#### Access the application:
- **Development**: `https://dev.trailerrent.se:NODEPORT_HTTPS`
- **Production**: `https://trailerrent.se:NODEPORT_HTTPS`

**Default login:**
- Email: `admin@trailerrent.se`
- Password: `Admin123!`

## 🔄 Deployment Flow

- **Push to `develop` branch** → Deploys to DEV environment (`trailer-rent-dev` namespace)
- **Push to `main` branch** → Deploys to PROD environment (`trailer-rent-prod` namespace)

## 🆘 Troubleshooting

### GitHub Actions failing?
1. Check the Actions tab for error details
2. Verify all 4 secrets are correctly set
3. Ensure KUBE_CONFIG is properly base64 encoded

### Can't access the application?
1. Check if pods are running: `kubectl get pods -n trailer-rent-dev`
2. Check ingress: `kubectl get ingress -n trailer-rent-dev`
3. Verify NodePort: `kubectl get svc -n ingress-nginx`

### Database connection issues?
1. Check postgres pod: `kubectl get pods -l app=postgres -n trailer-rent-dev`
2. Check logs: `kubectl logs -l app=postgres -n trailer-rent-dev`

## ✅ Success Indicators

You'll know everything is working when:
1. ✅ GitHub Actions workflow completes successfully
2. ✅ All pods are running: `kubectl get pods -n trailer-rent-dev`
3. ✅ You can access the application via browser
4. ✅ You can log in with the default credentials

That's it! Your complete CI/CD pipeline is now automated! 🎉
