# Development stage for local development with Docker Compose
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS development
WORKDIR /app
COPY . .
RUN dotnet restore
EXPOSE 80
EXPOSE 443
CMD ["dotnet", "watch", "run", "--project", "TrailerRent.API", "--urls", "https://+:443;http://+:80"]

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj files and restore dependencies
COPY TrailerRent.Models/TrailerRent.Models.csproj ./TrailerRent.Models/
COPY TrailerRent.Data/TrailerRent.Data.csproj ./TrailerRent.Data/
COPY TrailerRent.Business/TrailerRent.Business.csproj ./TrailerRent.Business/
COPY TrailerRent.API/TrailerRent.API.csproj ./TrailerRent.API/

RUN dotnet restore ./TrailerRent.API/TrailerRent.API.csproj

# Copy source code and build
COPY . .
RUN dotnet publish ./TrailerRent.API/TrailerRent.API.csproj -c Release -o out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Create a non-root user
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000

ENTRYPOINT ["dotnet", "TrailerRent.API.dll"]
