# Development Workflow Documentation

## Local Development Setup

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+
- Access to dev Kubernetes PostgreSQL database

### Quick Start

1. **Set Environment Variables**
   ```bash
   # Set required environment variables for dev Kubernetes database
   export ASPNETCORE_ENVIRONMENT=Development
   export DATABASE_CONNECTION_STRING="Host=YOUR_DEV_K8S_HOST;Port=5432;Database=trailerrent;Username=YOUR_USER;Password=YOUR_PASS;"
   export JWT_SECRET_KEY="YOUR_DEV_JWT_SECRET"
   export JWT_ISSUER="trailer-rent-dev"
   export JWT_AUDIENCE="trailer-rent-dev-users"
   ```

2. **Run Backend (Development)**
   ```bash
   cd src/backend/TrailerRent.API
   dotnet watch run
   ```

3. **Run Frontend**
   ```bash
   cd src/frontend/trailer-rent-app
   npm start
   ```

4. **Access Application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:5000
   - Swagger: http://localhost:5000/swagger

### Environment Configuration

#### Development (Local Development)
- **Purpose**: Local development against dev Kubernetes PostgreSQL
- **Configuration**: `appsettings.Development.json`
- **Database**: Dev Kubernetes PostgreSQL (managed by GitHub Actions)
- **Environment Variable**: `ASPNETCORE_ENVIRONMENT=Development`

#### Production (Kubernetes Production)
- **Purpose**: Production deployment
- **Configuration**: `appsettings.Production.json`
- **Database**: Production PostgreSQL instance
- **Environment Variable**: `ASPNETCORE_ENVIRONMENT=Production`
- **Deployment**: ArgoCD from `main` branch

### Database Connection

Your local development connects directly to the dev Kubernetes PostgreSQL database:
- **Database**: Managed by GitHub Actions/ArgoCD
- **Connection**: Set via environment variables
- **No local setup needed**: GitHub Actions handles all infrastructure

### Required Environment Variables

Set these environment variables for your local development:

```bash
export ASPNETCORE_ENVIRONMENT=Development
export DATABASE_CONNECTION_STRING="Host=YOUR_DEV_K8S_HOST;Port=5432;Database=trailerrent;Username=YOUR_USER;Password=YOUR_PASS;"
export JWT_SECRET_KEY="YOUR_DEV_JWT_SECRET"
export JWT_ISSUER="trailer-rent-dev"
export JWT_AUDIENCE="trailer-rent-dev-users"
```

### VS Code Debug Configuration

Use the debug configurations in `.vscode/launch.json`:
- **Launch Backend (Development)**: Debug backend against dev Kubernetes database
- **Launch Frontend**: Debug Angular application
- **Launch Full Stack**: Debug both frontend and backend simultaneously

### Workflow

1. **Feature Development**
   - Create feature branch from `develop`
   - Use Development environment for local testing
   - Test against dev Kubernetes database (same as CI/CD)

2. **Integration Testing**
   - Push to `develop` branch
   - GitHub Actions builds and tests
   - ArgoCD deploys to dev environment

3. **Production Release**
   - Merge `develop` to `main`
   - GitHub Actions builds and tests
   - ArgoCD deploys to production

### Troubleshooting

#### Database Connection Issues
```bash
# Check environment variables
echo $DATABASE_CONNECTION_STRING

# Verify connectivity to dev Kubernetes PostgreSQL
# (Use appropriate tools like psql or database client)
```

#### Environment Variables
```bash
# Check current environment
echo $ASPNETCORE_ENVIRONMENT

# Set development environment
export ASPNETCORE_ENVIRONMENT=Development

# Set database connection
export DATABASE_CONNECTION_STRING="Your dev K8s PostgreSQL connection string"
```

#### Port Conflicts
- Backend: Default port 5000 (configurable)
- Frontend: Default port 4200 (configurable)
