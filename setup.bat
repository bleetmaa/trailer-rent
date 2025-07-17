@echo off
REM Trailer Rent - Windows Setup Script
REM This script helps you set up the complete trailer rental application on Windows

echo 🚀 Trailer Rent - Complete Setup (Windows)
echo ==========================================

REM Check prerequisites
echo 📋 Checking prerequisites...

where docker >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Docker is required but not installed. Please install Docker Desktop.
    pause
    exit /b 1
)

where kubectl >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ kubectl is required but not installed. Please install kubectl.
    pause
    exit /b 1
)

where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Git is required but not installed. Please install Git.
    pause
    exit /b 1
)

echo ✅ All prerequisites satisfied!

REM Setup options
echo.
echo 🔧 Setup Options:
echo 1. Local Development (Docker Compose)
echo 2. Development Environment Only
echo 3. View Setup Instructions

set /p SETUP_OPTION=Choose setup option (1-3): 

if "%SETUP_OPTION%"=="1" (
    echo 🐳 Setting up local development environment...
    
    REM Generate HTTPS certificate for development
    if not exist "%USERPROFILE%\.aspnet\https\aspnetapp.pfx" (
        echo 🔐 Generating HTTPS certificate for development...
        mkdir "%USERPROFILE%\.aspnet\https" 2>nul
        dotnet dev-certs https -ep "%USERPROFILE%\.aspnet\https\aspnetapp.pfx" -p password --trust
    )
    
    REM Start services
    echo 🚀 Starting services with Docker Compose...
    docker-compose up -d
    
    echo ⏳ Waiting for services to be ready...
    timeout /t 30 /nobreak >nul
    
    REM Run database migrations
    echo 💾 Running database migrations...
    docker-compose exec backend dotnet ef database update --project TrailerRent.Data --startup-project TrailerRent.API
    
    echo ✅ Local development environment is ready!
    echo 🌐 Frontend: http://localhost:4200
    echo 🔗 Backend API: https://localhost:7001
    echo 📊 PostgreSQL: localhost:5432
    echo.
    echo Default admin credentials:
    echo Email: admin@trailerrent.se
    echo Password: Admin123!
    
) else if "%SETUP_OPTION%"=="2" (
    echo 💻 Setting up development environment only...
    
    REM Install frontend dependencies
    echo 📦 Installing frontend dependencies...
    cd src\frontend\trailer-rent-app
    call npm install
    cd ..\..\..
    
    REM Restore backend dependencies
    echo 📦 Restoring backend dependencies...
    cd src\backend
    call dotnet restore
    cd ..\..
    
    echo ✅ Development environment setup completed!
    echo.
    echo 🚀 To start development:
    echo Frontend: cd src\frontend\trailer-rent-app ^&^& npm start
    echo Backend: cd src\backend ^&^& dotnet run --project TrailerRent.API
    echo Database: Use PostgreSQL connection string in appsettings.json
    
) else if "%SETUP_OPTION%"=="3" (
    echo 📋 Full Setup Instructions:
    echo.
    echo 1. **Local Development:**
    echo    - Run: setup.bat (option 1)
    echo    - This starts all services with Docker Compose
    echo.
    echo 2. **Kubernetes Deployment:**
    echo    - Ensure kubectl is configured for your cluster
    echo    - Create namespaces: trailer-rent-dev, trailer-rent-qa, trailer-rent-prod
    echo    - Create secrets for PostgreSQL password and JWT key
    echo    - Deploy: kubectl apply -k k8s/environments/dev
    echo.
    echo 3. **CI/CD Pipeline:**
    echo    - Create GitHub repository and push code
    echo    - Set repository secrets: KUBE_CONFIG, POSTGRES_PASSWORD, KUBERNETES_PUBLIC_IP
    echo    - Install ArgoCD in cluster
    echo    - Deploy ArgoCD applications: kubectl apply -f argocd/applications.yaml
    echo.
    echo 4. **Domain Configuration:**
    echo    - Point dev.trailerrent.se to your cluster IP
    echo    - Point trailerrent.se to your cluster IP for production
    echo.
    echo 5. **Security Configuration:**
    echo    - Update JWT secret keys in production
    echo    - Configure HTTPS certificates
    echo    - Review security settings in appsettings.json
    
) else (
    echo ❌ Invalid option selected.
    pause
    exit /b 1
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📚 Next steps:
echo - Review the documentation in docs/adr/
echo - Check the README.md for detailed instructions
echo - Configure your domain DNS settings
echo - Set up monitoring and alerting
echo.
echo 🆘 Need help? Check the troubleshooting section in README.md
pause
