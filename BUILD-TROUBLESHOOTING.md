# Build Troubleshooting Guide

This document helps resolve common build issues encountered during CI/CD pipeline execution.

## ✅ **Recently Fixed Issues**

### 1. Duplicate MappingProfile Classes (CS0101)
**Error**: `The namespace 'TrailerRent.Business.Mapping' already contains a definition for 'MappingProfile'`
**Fix**: Removed duplicate `MappingProfile.cs`, kept `AutoMapperProfile.cs`
**Status**: ✅ RESOLVED

### 2. JWT Security Vulnerability (NU1902)
**Error**: `Package 'System.IdentityModel.Tokens.Jwt' 7.0.3 has a known moderate severity vulnerability`
**Fix**: Updated to version 8.1.2
**Status**: ✅ RESOLVED

### 3. AutoMapper Configuration Issues (CS0246, CS1061)
**Error**: 
- `The type or namespace name 'AutoMapperProfile' could not be found`
- `'IServiceCollection' does not contain a definition for 'AddAutoMapper'`
**Fix**: 
- Added `AutoMapper.Extensions.Microsoft.DependencyInjection` package
- Fixed class name reference in Program.cs
**Status**: ✅ RESOLVED

### 4. Angular Test Failures
**Error**: `Expected undefined to contain 'Hello, trailer-rent-app'`
**Fix**: 
- Updated app.spec.ts to test actual component structure
- Added proper testing modules (RouterTestingModule, HttpClientTestingModule)
- Made App.title property public for testing
**Status**: ✅ RESOLVED

## 🔧 **Build Process Overview**

The GitHub Actions CI/CD pipeline performs these steps:

1. **Backend Tests**: `dotnet test src/backend/TrailerRent.sln`
2. **Frontend Tests**: `npm run build` in Angular app
3. **Docker Build**: Build and push container images
4. **Deploy**: Deploy to Kubernetes cluster

## 🚨 **Common Issues & Solutions**

### Package Version Conflicts
```bash
# Check for security vulnerabilities
dotnet list package --vulnerable

# Update specific package
dotnet add package PackageName --version x.x.x
```

### Missing Dependencies
```bash
# Restore all packages
dotnet restore

# Check package references
dotnet list package
```

### AutoMapper Issues
```csharp
// Ensure these packages are referenced:
// - AutoMapper (in Business layer)
// - AutoMapper.Extensions.Microsoft.DependencyInjection (in API layer)

// Registration in Program.cs:
builder.Services.AddAutoMapper(typeof(TrailerRent.Business.Mapping.MappingProfile));
```

### Angular Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run build
```

## 📊 **Build Status Monitoring**

**GitHub Actions**: https://github.com/bleetmaa/trailer-rent/actions

**Successful Build Indicators**:
- ✅ All tests pass
- ✅ Docker images build successfully
- ✅ Deployment to Kubernetes succeeds

**Failed Build Indicators**:
- ❌ Compilation errors
- ❌ Test failures
- ❌ Security vulnerabilities
- ❌ Docker build failures

## 🔍 **Debugging Steps**

1. **Check GitHub Actions logs** for detailed error messages
2. **Review recent commits** for changes that might cause issues
3. **Test locally** if possible (requires .NET SDK and Node.js)
4. **Check package versions** for conflicts or vulnerabilities
5. **Verify file references** and namespaces

## 📞 **Getting Help**

If you encounter new build issues:
1. Check this troubleshooting guide first
2. Review GitHub Actions logs for specific errors
3. Check for breaking changes in dependencies
4. Ensure all required packages are properly referenced

## 🎯 **Next Steps After Successful Build**

Once the build passes:
1. Monitor deployment to Kubernetes cluster
2. Verify application pods are running
3. Test application access via configured domains
4. Set up monitoring and logging
