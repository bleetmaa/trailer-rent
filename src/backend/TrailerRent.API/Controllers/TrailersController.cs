using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrailerRent.Business.Services;
using TrailerRent.Models.DTOs;

namespace TrailerRent.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrailersController : ControllerBase
{
    private readonly ITrailerService _trailerService;
    private readonly ILogger<TrailersController> _logger;

    public TrailersController(ITrailerService trailerService, ILogger<TrailersController> logger)
    {
        _trailerService = trailerService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TrailerDto>>> GetAll()
    {
        var trailers = await _trailerService.GetAllAsync();
        return Ok(trailers);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TrailerDto>> GetById(int id)
    {
        var trailer = await _trailerService.GetByIdAsync(id);
        if (trailer == null)
            return NotFound();
        
        return Ok(trailer);
    }

    [HttpGet("available")]
    public async Task<ActionResult<IEnumerable<TrailerDto>>> GetAvailable()
    {
        var trailers = await _trailerService.GetAvailableAsync();
        return Ok(trailers);
    }

    [HttpGet("available-for-dates")]
    public async Task<ActionResult<IEnumerable<TrailerDto>>> GetAvailableForDates(
        [FromQuery] DateTime startDate, 
        [FromQuery] DateTime endDate)
    {
        try
        {
            _logger.LogInformation("GetAvailableForDates called with startDate: {StartDate}, endDate: {EndDate}", startDate, endDate);
            var trailers = await _trailerService.GetAvailableForDateRangeAsync(startDate, endDate);
            _logger.LogInformation("Found {Count} available trailers", trailers.Count());
            return Ok(trailers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetAvailableForDates");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<TrailerDto>> Create([FromBody] CreateTrailerDto createTrailerDto)
    {
        var trailer = await _trailerService.CreateAsync(createTrailerDto);
        return CreatedAtAction(nameof(GetById), new { id = trailer.Id }, trailer);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult<TrailerDto>> Update(int id, [FromBody] CreateTrailerDto updateTrailerDto)
    {
        var trailer = await _trailerService.UpdateAsync(id, updateTrailerDto);
        return Ok(trailer);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> Delete(int id)
    {
        await _trailerService.DeleteAsync(id);
        return NoContent();
    }
}
