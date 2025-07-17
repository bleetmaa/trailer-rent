#!/bin/bash

# Trailer Rent - Complete Setup Script
# This script helps you set up the complete trailer rental application

set -e

echo "🚀 Trailer Rent - Complete Setup"
echo "================================="

# Check prerequisites
echo "📋 Checking prerequisites..."

command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting." >&2; exit 1; }
command -v kubectl >/dev/null 2>&1 || { echo "❌ kubectl is required but not installed. Aborting." >&2; exit 1; }
command -v git >/dev/null 2>&1 || { echo "❌ Git is required but not installed. Aborting." >&2; exit 1; }

echo "✅ All prerequisites satisfied!"

# Setup options
echo ""
echo "🔧 Setup Options:"
echo "1. Local Development (Docker Compose)"
echo "2. Kubernetes Deployment"
echo "3. Full CI/CD Setup"
echo "4. Development Environment Only"

read -p "Choose setup option (1-4): " SETUP_OPTION

case $SETUP_OPTION in
    1)
        echo "🐳 Setting up local development environment..."
        
        # Generate HTTPS certificate for development
        if [ ! -f ~/.aspnet/https/aspnetapp.pfx ]; then
            echo "🔐 Generating HTTPS certificate for development..."
            mkdir -p ~/.aspnet/https
            dotnet dev-certs https -ep ~/.aspnet/https/aspnetapp.pfx -p password --trust
        fi
        
        # Start services
        echo "🚀 Starting services with Docker Compose..."
        docker-compose up -d
        
        echo "⏳ Waiting for services to be ready..."
        sleep 30
        
        # Run database migrations
        echo "💾 Running database migrations..."
        docker-compose exec backend dotnet ef database update --project TrailerRent.Data --startup-project TrailerRent.API
        
        echo "✅ Local development environment is ready!"
        echo "🌐 Frontend: http://localhost:4200"
        echo "🔗 Backend API: https://localhost:7001"
        echo "📊 PostgreSQL: localhost:5432"
        echo ""
        echo "Default admin credentials:"
        echo "Email: admin@trailerrent.se"
        echo "Password: Admin123!"
        ;;
        
    2)
        echo "☸️ Setting up Kubernetes deployment..."
        
        # Check if kubectl is configured
        kubectl cluster-info >/dev/null 2>&1 || { echo "❌ kubectl is not configured for a cluster. Please configure kubectl first." >&2; exit 1; }
        
        echo "📦 Creating namespaces..."
        kubectl create namespace trailer-rent-dev --dry-run=client -o yaml | kubectl apply -f -
        kubectl create namespace trailer-rent-qa --dry-run=client -o yaml | kubectl apply -f -
        kubectl create namespace trailer-rent-prod --dry-run=client -o yaml | kubectl apply -f -
        
        # Create secrets (user needs to provide values)
        echo "🔐 Creating secrets..."
        echo "Please provide the following information:"
        
        read -s -p "PostgreSQL password: " POSTGRES_PASSWORD
        echo ""
        read -p "JWT secret key (256-bit): " JWT_KEY
        
        # Create secrets for each environment
        for ENV in dev qa prod; do
            kubectl create secret generic postgres-secret \
                --from-literal=password=$POSTGRES_PASSWORD \
                --namespace=trailer-rent-$ENV \
                --dry-run=client -o yaml | kubectl apply -f -
                
            kubectl create secret generic jwt-secret \
                --from-literal=key=$JWT_KEY \
                --namespace=trailer-rent-$ENV \
                --dry-run=client -o yaml | kubectl apply -f -
        done
        
        # Deploy development environment
        echo "🚀 Deploying to development environment..."
        kubectl apply -k k8s/environments/dev
        
        echo "⏳ Waiting for deployment to be ready..."
        kubectl wait --for=condition=available --timeout=300s deployment/postgres -n trailer-rent-dev
        kubectl wait --for=condition=available --timeout=300s deployment/backend -n trailer-rent-dev
        kubectl wait --for=condition=available --timeout=300s deployment/frontend -n trailer-rent-dev
        
        echo "✅ Kubernetes deployment completed!"
        echo "📝 Don't forget to configure your DNS:"
        echo "   dev.trailerrent.se → $(kubectl get service ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].ip}')"
        ;;
        
    3)
        echo "🔄 Setting up full CI/CD pipeline..."
        
        # Initialize git repository if not already done
        if [ ! -d .git ]; then
            echo "📂 Initializing Git repository..."
            git init
            git add .
            git commit -m "Initial commit: Complete trailer rental application"
        fi
        
        echo "📋 CI/CD Setup Instructions:"
        echo ""
        echo "1. Create a GitHub repository and push this code:"
        echo "   git remote add origin https://github.com/yourusername/trailer-rent.git"
        echo "   git branch -M main"
        echo "   git push -u origin main"
        echo ""
        echo "2. Create a develop branch:"
        echo "   git checkout -b develop"
        echo "   git push -u origin develop"
        echo ""
        echo "3. Configure GitHub repository secrets:"
        echo "   - KUBE_CONFIG: Base64 encoded kubeconfig file"
        echo "   - POSTGRES_PASSWORD: Database password"
        echo "   - KUBERNETES_PUBLIC_IP: Cluster public IP"
        echo ""
        echo "4. Install ArgoCD in your cluster:"
        echo "   kubectl create namespace argocd"
        echo "   kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml"
        echo ""
        echo "5. Deploy ArgoCD applications:"
        echo "   kubectl apply -f argocd/applications.yaml"
        echo ""
        echo "✅ Your CI/CD pipeline is configured!"
        ;;
        
    4)
        echo "💻 Setting up development environment only..."
        
        # Install frontend dependencies
        echo "📦 Installing frontend dependencies..."
        cd src/frontend/trailer-rent-app
        npm install
        cd ../../..
        
        # Restore backend dependencies
        echo "📦 Restoring backend dependencies..."
        cd src/backend
        dotnet restore
        cd ../..
        
        echo "✅ Development environment setup completed!"
        echo ""
        echo "🚀 To start development:"
        echo "Frontend: cd src/frontend/trailer-rent-app && npm start"
        echo "Backend: cd src/backend && dotnet run --project TrailerRent.API"
        echo "Database: Use PostgreSQL connection string in appsettings.json"
        ;;
        
    *)
        echo "❌ Invalid option selected."
        exit 1
        ;;
esac

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📚 Next steps:"
echo "- Review the documentation in docs/adr/"
echo "- Check the README.md for detailed instructions"
echo "- Configure your domain DNS settings"
echo "- Set up monitoring and alerting"
echo ""
echo "🆘 Need help? Check the troubleshooting section in README.md"
