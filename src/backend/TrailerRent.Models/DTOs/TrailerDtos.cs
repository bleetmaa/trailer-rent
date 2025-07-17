using System.ComponentModel.DataAnnotations;
using TrailerRent.Models.Entities;

namespace TrailerRent.Models.DTOs;

public class TrailerDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TrailerType Type { get; set; }
    public decimal PricePerDay { get; set; }
    public double MaxWeight { get; set; }
    public string? LicensePlate { get; set; }
    public bool IsAvailable { get; set; }
    public List<TrailerImageDto> Images { get; set; } = new();
}

public class CreateTrailerDto
{
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
}

public class TrailerImageDto
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsPrimary { get; set; }
}
