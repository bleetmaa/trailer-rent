using System.ComponentModel.DataAnnotations;
using TrailerRent.Models.Entities;

namespace TrailerRent.Models.DTOs;

public class RentalDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public UserDto User { get; set; } = null!;
    public int TrailerId { get; set; }
    public TrailerDto Trailer { get; set; } = null!;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal TotalPrice { get; set; }
    public RentalStatus Status { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateRentalDto
{
    [Required]
    public int TrailerId { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    public string? Notes { get; set; }
}

public class UpdateRentalStatusDto
{
    [Required]
    public RentalStatus Status { get; set; }
}
