using Microsoft.EntityFrameworkCore;
using TrailerRent.Models.Entities;

namespace TrailerRent.Data;

public class TrailerRentDbContext : DbContext
{
    public TrailerRentDbContext(DbContextOptions<TrailerRentDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Trailer> Trailers { get; set; }
    public DbSet<Rental> Rentals { get; set; }
    public DbSet<TrailerImage> TrailerImages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User entity configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(256);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
        });

        // Trailer entity configuration
        modelBuilder.Entity<Trailer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Type).HasConversion<string>();
            entity.Property(e => e.PricePerDay).HasColumnType("decimal(18,2)");
            entity.Property(e => e.LicensePlate).HasMaxLength(50);
        });

        // Rental entity configuration
        modelBuilder.Entity<Rental>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TotalPrice).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Status).HasConversion<string>();

            entity.HasOne(e => e.User)
                .WithMany(u => u.Rentals)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Trailer)
                .WithMany(t => t.Rentals)
                .HasForeignKey(e => e.TrailerId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // TrailerImage entity configuration
        modelBuilder.Entity<TrailerImage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ImageUrl).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(200);

            entity.HasOne(e => e.Trailer)
                .WithMany(t => t.Images)
                .HasForeignKey(e => e.TrailerId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Seed data
        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        // Seed sample trailers
        modelBuilder.Entity<Trailer>().HasData(
            new Trailer
            {
                Id = 1,
                Name = "Heavy Duty Cargo Trailer",
                Description = "Perfect for moving furniture and large items",
                Type = TrailerType.Cargo,
                PricePerDay = 75.00m,
                MaxWeight = 3500,
                LicensePlate = "TRL001",
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Trailer
            {
                Id = 2,
                Name = "Utility Trailer",
                Description = "Great for garden waste and small moves",
                Type = TrailerType.Utility,
                PricePerDay = 45.00m,
                MaxWeight = 1500,
                LicensePlate = "TRL002",
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Trailer
            {
                Id = 3,
                Name = "Boat Trailer",
                Description = "Specialized trailer for boats up to 20 feet",
                Type = TrailerType.Boat,
                PricePerDay = 95.00m,
                MaxWeight = 2500,
                LicensePlate = "TRL003",
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        );
    }
}
