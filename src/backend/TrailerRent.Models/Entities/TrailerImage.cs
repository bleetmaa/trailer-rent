using System.ComponentModel.DataAnnotations;

namespace TrailerRent.Models.Entities;

public class TrailerImage
{
    public int Id { get; set; }

    [Required]
    public int TrailerId { get; set; }
    public Trailer Trailer { get; set; } = null!;

    [Required]
    public string ImageUrl { get; set; } = string.Empty;

    [StringLength(200)]
    public string? Description { get; set; }

    public bool IsPrimary { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
