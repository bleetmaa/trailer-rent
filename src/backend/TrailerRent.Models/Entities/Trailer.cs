using System.ComponentModel.DataAnnotations;

namespace TrailerRent.Models.Entities;

public class Trailer
{
    public int Id { get; set; }

    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    public TrailerType Type { get; set; }

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal PricePerDay { get; set; }

    [Range(0, double.MaxValue)]
    public double MaxWeight { get; set; }

    [StringLength(50)]
    public string? LicensePlate { get; set; }

    public bool IsAvailable { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Rental> Rentals { get; set; } = new List<Rental>();
    public ICollection<TrailerImage> Images { get; set; } = new List<TrailerImage>();
}

public enum TrailerType
{
    Cargo,
    Utility,
    Boat,
    Car,
    Equipment,
    Livestock,
    Refrigerated
}
