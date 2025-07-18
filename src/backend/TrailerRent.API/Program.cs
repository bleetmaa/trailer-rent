using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using TrailerRent.API.Middleware;
using TrailerRent.Business.Mapping;
using TrailerRent.Business.Services;
using TrailerRent.Data;
using TrailerRent.Data.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger configuration
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "TrailerRent API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Database configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// If running in Kubernetes (Production), build connection string from environment variables
if (builder.Environment.IsProduction())
{
    var host = Environment.GetEnvironmentVariable("POSTGRES_HOST") ?? "localhost";
    var database = Environment.GetEnvironmentVariable("POSTGRES_DB") ?? "trailerrent";
    var username = Environment.GetEnvironmentVariable("POSTGRES_USER") ?? "postgres";
    var password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD") ?? "postgres";
    
    connectionString = $"Host={host};Database={database};Username={username};Password={password}";
}

builder.Services.AddDbContext<TrailerRentDbContext>(options =>
    options.UseNpgsql(connectionString));

// AutoMapper
builder.Services.AddAutoMapper(typeof(TrailerRent.Business.Mapping.MappingProfile));

// JWT Configuration
var jwtKey = builder.Configuration["Jwt:Key"] ?? Environment.GetEnvironmentVariable("Jwt__Key") ?? throw new InvalidOperationException("JWT Key not configured");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? Environment.GetEnvironmentVariable("Jwt__Issuer") ?? throw new InvalidOperationException("JWT Issuer not configured");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtIssuer,
            RequireExpirationTime = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITrailerRepository, TrailerRepository>();
builder.Services.AddScoped<IRentalRepository, RentalRepository>();

// Register services
builder.Services.AddScoped<IAuthService>(provider =>
{
    var userRepository = provider.GetRequiredService<IUserRepository>();
    var mapper = provider.GetRequiredService<AutoMapper.IMapper>();
    return new AuthService(userRepository, mapper, jwtKey, jwtIssuer);
});
builder.Services.AddScoped<ITrailerService, TrailerService>();
builder.Services.AddScoped<IRentalService, RentalService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Custom middleware
app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseHttpsRedirection();
app.UseCors("AllowAngularApp");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TrailerRentDbContext>();
    context.Database.EnsureCreated();
}

app.Run();
