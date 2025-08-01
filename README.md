# Trailer Rent - Complete Rental Management Platform

A comprehensive trailer rental application built with Angular frontend, ASP.NET Core backend, and PostgreSQL database, designed for Kubernetes deployment with GitOps CI/CD pipeline.

## 🏗️ Architecture Overview

### Frontend
- **Angular 18** with Material Design
- **TypeScript** for type safety
- **Reactive Forms** for form handling
- **JWT Authentication** with route guards
- **Responsive design** for mobile/desktop

### Backend
- **ASP.NET Core 8.0** Web API
- **3-tier architecture** (API, Business, Data, Models)
- **Entity Framework Core** with PostgreSQL
- **JWT Authentication** with BCrypt password hashing
- **AutoMapper** for object mapping
- **Comprehensive error handling**

### Database
- **PostgreSQL 15** with persistent storage
- **Entity Framework migrations** for schema management
- **Seeded data** for development and testing

### DevOps & Deployment
- **Docker** containerization with multi-stage builds
- **Kubernetes** orchestration with multiple environments
- **GitHub Actions** CI/CD pipeline
- **ArgoCD** GitOps deployment
- **GitHub Container Registry** for image storage

## 🚀 Quick Start

### Prerequisites
- **Docker** and **Docker Compose**
- **Kubernetes cluster** (local or cloud)
- **kubectl** configured for your cluster
- **ArgoCD** installed in your cluster
- **GitHub repository** with Actions enabled

### 1. Clone and Initialize

```bash
git clone https://github.com/yourusername/trailer-rent.git
cd trailer-rent
```

### 2. Environment Setup

Create GitHub repository secrets:
- `KUBE_CONFIG`: Base64 encoded kubeconfig file
- `POSTGRES_PASSWORD`: Strong database password (e.g., `TrailerRent2025!SecureDB`)
- `JWT_SECRET_KEY`: 256-bit secret key for JWT tokens
- `KUBERNETES_PUBLIC_IP`: Your cluster's public IP (192.168.1.66)

### 3. Deploy to Kubernetes

```bash
# Apply base Kubernetes manifests
kubectl apply -k k8s/environments/dev

# Install ArgoCD applications
kubectl apply -f argocd/applications.yaml
```

### 4. Access the Application

After setting up port forwarding and DNS:
- **Development**: `https://dev.trailerrent.se`
- **Production**: `https://trailerrent.se`

**Port Forwarding Required:**
- Router port 80 → 192.168.1.66:31720 (HTTP)
- Router port 443 → 192.168.1.66:31915 (HTTPS)

**DNS Setup:**
- Point your domain to your public IP, OR
- Add to Windows hosts file: `YOUR_PUBLIC_IP dev.trailerrent.se`

Default admin credentials:
- **Email**: `admin@trailerrent.se`
- **Password**: `Admin123!`

## 🛠️ Development Setup

### Local Development with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Frontend Development

```bash
cd src/frontend/trailer-rent-app
npm install
npm start
# Application available at http://localhost:4200
```

### Backend Development

```bash
cd src/backend
dotnet restore
dotnet run --project TrailerRent.API
# API available at https://localhost:7001
```

### Database Migrations

```bash
cd src/backend
dotnet ef migrations add InitialCreate --project TrailerRent.Data --startup-project TrailerRent.API
dotnet ef database update --project TrailerRent.Data --startup-project TrailerRent.API
```

## 📁 Project Structure

```
trailer-rent/
├── src/
│   ├── backend/                    # ASP.NET Core Solution
│   │   ├── TrailerRent.API/        # Web API Controllers
│   │   ├── TrailerRent.Business/   # Business Logic Layer
│   │   ├── TrailerRent.Data/       # Data Access Layer
│   │   └── TrailerRent.Models/     # Domain Models & DTOs
│   └── frontend/
│       └── trailer-rent-app/       # Angular Application
├── k8s/                           # Kubernetes Manifests
│   ├── base/                      # Base configurations
│   └── environments/              # Environment-specific configs
│       ├── dev/
│       ├── qa/
│       └── prod/
├── argocd/                        # ArgoCD Applications
├── docs/
│   └── adr/                       # Architecture Decision Records
├── .github/
│   └── workflows/                 # GitHub Actions CI/CD
└── docker-compose.yml            # Local development setup
```

## 🔐 Security Features

- **JWT Authentication** with refresh tokens
- **BCrypt password hashing** with salt
- **Role-based authorization** (User, Admin)
- **CORS protection** with environment-specific origins
- **HTTPS enforcement** in production
- **Input validation** on frontend and backend
- **SQL injection prevention** with EF Core

## 🌍 Multi-Environment Deployment

### Environments
- **DEV**: Development environment (`develop` branch)
- **QA**: Quality assurance environment (manual promotion)
- **PROD**: Production environment (`main` branch)

### Environment Configuration
Each environment has isolated:
- Kubernetes namespace
- Database instance
- Domain/subdomain
- Configuration values

## 📊 CI/CD Pipeline

### GitHub Actions Workflow
1. **Build & Test**: Compile and run unit tests
2. **Security Scan**: Vulnerability scanning
3. **Docker Build**: Create and push images
4. **Deploy**: Update Kubernetes manifests
5. **ArgoCD Sync**: Automatic deployment via GitOps

### Deployment Flow
```
Code Push → GitHub Actions → Container Registry → ArgoCD → Kubernetes
```

## 🔍 Monitoring & Observability

### Health Checks
- Application health endpoints
- Database connectivity checks
- Kubernetes liveness/readiness probes

### Logging
- Structured logging with Serilog
- Centralized log aggregation
- Error tracking and alerting

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `develop`
2. Implement changes with tests
3. Create pull request
4. Code review and approval
5. Merge to `develop` for DEV deployment
6. Merge to `main` for PROD deployment

### Coding Standards
- **C#**: Follow Microsoft .NET conventions
- **TypeScript**: Use ESLint and Prettier
- **Git**: Conventional commit messages
- **Testing**: Minimum 80% code coverage

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh

### Trailer Management
- `GET /api/trailers` - List available trailers
- `GET /api/trailers/{id}` - Get trailer details
- `POST /api/trailers` - Create new trailer (Admin)
- `PUT /api/trailers/{id}` - Update trailer (Admin)
- `DELETE /api/trailers/{id}` - Delete trailer (Admin)

### Rental Management
- `GET /api/rentals` - List user rentals
- `POST /api/rentals` - Create new rental
- `PUT /api/rentals/{id}` - Update rental
- `DELETE /api/rentals/{id}` - Cancel rental

## 🆘 Troubleshooting

### Common Issues

**Database Connection Issues**
```bash
# Check PostgreSQL pod status
kubectl get pods -l app=postgres

# View PostgreSQL logs
kubectl logs -l app=postgres
```

**ArgoCD Sync Issues**
```bash
# Check ArgoCD application status
kubectl get applications -n argocd

# Force sync application
argocd app sync trailer-rent-dev
```

**Docker Build Issues**
```bash
# Check GitHub Actions logs
# Verify Dockerfile syntax
# Ensure all dependencies are available
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For questions or support:
- Create an issue in GitHub
- Review Architecture Decision Records in `/docs/adr/`
- Check deployment logs in ArgoCD dashboard - Professional Trailer Rental Platform
# Test deployment
# Deployment test 07/17/2025 23:50:04
