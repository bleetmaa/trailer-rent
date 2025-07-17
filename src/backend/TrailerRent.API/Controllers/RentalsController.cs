using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TrailerRent.Business.Services;
using TrailerRent.Models.DTOs;

namespace TrailerRent.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RentalsController : ControllerBase
{
    private readonly IRentalService _rentalService;

    public RentalsController(IRentalService rentalService)
    {
        _rentalService = rentalService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RentalDto>>> GetAll()
    {
        var rentals = await _rentalService.GetAllAsync();
        return Ok(rentals);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RentalDto>> GetById(int id)
    {
        var rental = await _rentalService.GetByIdAsync(id);
        if (rental == null)
            return NotFound();
        
        return Ok(rental);
    }

    [HttpGet("my-rentals")]
    public async Task<ActionResult<IEnumerable<RentalDto>>> GetMyRentals()
    {
        var userId = GetCurrentUserId();
        var rentals = await _rentalService.GetUserRentalsAsync(userId);
        return Ok(rentals);
    }

    [HttpPost]
    public async Task<ActionResult<RentalDto>> Create([FromBody] CreateRentalDto createRentalDto)
    {
        var userId = GetCurrentUserId();
        var rental = await _rentalService.CreateAsync(userId, createRentalDto);
        return CreatedAtAction(nameof(GetById), new { id = rental.Id }, rental);
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult<RentalDto>> UpdateStatus(int id, [FromBody] UpdateRentalStatusDto updateStatusDto)
    {
        var rental = await _rentalService.UpdateStatusAsync(id, updateStatusDto);
        return Ok(rental);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await _rentalService.DeleteAsync(id);
        return NoContent();
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user token");
        }
        return userId;
    }
}
