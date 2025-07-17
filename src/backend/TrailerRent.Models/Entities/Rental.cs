using System.ComponentModel.DataAnnotations;

namespace TrailerRent.Models.Entities;

public class Rental
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Required]
    public int TrailerId { get; set; }
    public Trailer Trailer { get; set; } = null!;

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal TotalPrice { get; set; }

    [Required]
    public RentalStatus Status { get; set; } = RentalStatus.Pending;

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum RentalStatus
{
    Pending,
    Confirmed,
    Active,
    Completed,
    Cancelled
}
