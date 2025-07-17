using Microsoft.EntityFrameworkCore;
using TrailerRent.Models.Entities;

namespace TrailerRent.Data.Repositories;

public class TrailerRepository : ITrailerRepository
{
    private readonly TrailerRentDbContext _context;

    public TrailerRepository(TrailerRentDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Trailer>> GetAllAsync()
    {
        return await _context.Trailers
            .Include(t => t.Images)
            .ToListAsync();
    }

    public async Task<Trailer?> GetByIdAsync(int id)
    {
        return await _context.Trailers
            .Include(t => t.Images)
            .Include(t => t.Rentals)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<IEnumerable<Trailer>> GetAvailableAsync()
    {
        return await _context.Trailers
            .Include(t => t.Images)
            .Where(t => t.IsAvailable)
            .ToListAsync();
    }

    public async Task<IEnumerable<Trailer>> GetAvailableForDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        var conflictingTrailerIds = await _context.Rentals
            .Where(r => r.Status != RentalStatus.Cancelled &&
                       r.Status != RentalStatus.Completed &&
                       ((r.StartDate <= startDate && r.EndDate >= startDate) ||
                        (r.StartDate <= endDate && r.EndDate >= endDate) ||
                        (r.StartDate >= startDate && r.EndDate <= endDate)))
            .Select(r => r.TrailerId)
            .ToListAsync();

        return await _context.Trailers
            .Include(t => t.Images)
            .Where(t => t.IsAvailable && !conflictingTrailerIds.Contains(t.Id))
            .ToListAsync();
    }

    public async Task<Trailer> CreateAsync(Trailer trailer)
    {
        _context.Trailers.Add(trailer);
        await _context.SaveChangesAsync();
        return trailer;
    }

    public async Task<Trailer> UpdateAsync(Trailer trailer)
    {
        trailer.UpdatedAt = DateTime.UtcNow;
        _context.Trailers.Update(trailer);
        await _context.SaveChangesAsync();
        return trailer;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var trailer = await _context.Trailers.FindAsync(id);
        if (trailer == null) return false;

        _context.Trailers.Remove(trailer);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Trailers.AnyAsync(t => t.Id == id);
    }
}
