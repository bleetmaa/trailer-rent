# TrailerRent Backend

This is the backend API for the TrailerRent application, built with ASP.NET Core 8.0 following a 3-tier architecture.

## Architecture

### Presentation Layer (API)
- **TrailerRent.API**: Web API controllers, middleware, and configuration

### Business Logic Layer  
- **TrailerRent.Business**: Services, business rules, validation, and DTOs mapping

### Data Access Layer
- **TrailerRent.Data**: Entity Framework Core, repositories, and database context
- **TrailerRent.Models**: Domain models, entities, and DTOs

## Features

- JWT Authentication
- PostgreSQL database with Entity Framework Core
- AutoMapper for object mapping
- Swagger/OpenAPI documentation
- CORS enabled for Angular frontend
- Custom exception handling middleware
- Repository pattern for data access
- Service layer for business logic

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- PostgreSQL 15+

### Development Setup

1. Update connection string in `appsettings.json`
2. Run the application:
   ```bash
   dotnet run --project TrailerRent.API
   ```
3. Access Swagger UI at: `https://localhost:5001/swagger`

### Database Migrations

```bash
# Add migration
dotnet ef migrations add InitialCreate --project TrailerRent.Data --startup-project TrailerRent.API

# Update database
dotnet ef database update --project TrailerRent.Data --startup-project TrailerRent.API
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Trailers
- `GET /api/trailers` - Get all trailers
- `GET /api/trailers/{id}` - Get trailer by ID
- `GET /api/trailers/available` - Get available trailers
- `GET /api/trailers/available-for-dates` - Get available trailers for date range
- `POST /api/trailers` - Create trailer (Auth required)
- `PUT /api/trailers/{id}` - Update trailer (Auth required)
- `DELETE /api/trailers/{id}` - Delete trailer (Auth required)

### Rentals
- `GET /api/rentals` - Get all rentals (Auth required)
- `GET /api/rentals/{id}` - Get rental by ID (Auth required)
- `GET /api/rentals/my-rentals` - Get current user's rentals (Auth required)
- `POST /api/rentals` - Create rental (Auth required)
- `PATCH /api/rentals/{id}/status` - Update rental status (Auth required)
- `DELETE /api/rentals/{id}` - Delete rental (Auth required)
