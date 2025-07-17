using Microsoft.EntityFrameworkCore;
using TrailerRent.Models.Entities;

namespace TrailerRent.Data.Repositories;

public class RentalRepository : IRentalRepository
{
    private readonly TrailerRentDbContext _context;

    public RentalRepository(TrailerRentDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Rental>> GetAllAsync()
    {
        return await _context.Rentals
            .Include(r => r.User)
            .Include(r => r.Trailer)
                .ThenInclude(t => t.Images)
            .ToListAsync();
    }

    public async Task<Rental?> GetByIdAsync(int id)
    {
        return await _context.Rentals
            .Include(r => r.User)
            .Include(r => r.Trailer)
                .ThenInclude(t => t.Images)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<IEnumerable<Rental>> GetByUserIdAsync(int userId)
    {
        return await _context.Rentals
            .Include(r => r.Trailer)
                .ThenInclude(t => t.Images)
            .Where(r => r.UserId == userId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Rental>> GetByTrailerIdAsync(int trailerId)
    {
        return await _context.Rentals
            .Include(r => r.User)
            .Where(r => r.TrailerId == trailerId)
            .ToListAsync();
    }

    public async Task<Rental> CreateAsync(Rental rental)
    {
        _context.Rentals.Add(rental);
        await _context.SaveChangesAsync();

        // Return the rental with includes
        return await GetByIdAsync(rental.Id) ?? rental;
    }

    public async Task<Rental> UpdateAsync(Rental rental)
    {
        rental.UpdatedAt = DateTime.UtcNow;
        _context.Rentals.Update(rental);
        await _context.SaveChangesAsync();
        return rental;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var rental = await _context.Rentals.FindAsync(id);
        if (rental == null) return false;

        _context.Rentals.Remove(rental);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Rentals.AnyAsync(r => r.Id == id);
    }

    public async Task<bool> IsTrailerAvailableAsync(int trailerId, DateTime startDate, DateTime endDate, int? excludeRentalId = null)
    {
        var query = _context.Rentals
            .Where(r => r.TrailerId == trailerId &&
                       r.Status != RentalStatus.Cancelled &&
                       r.Status != RentalStatus.Completed &&
                       ((r.StartDate <= startDate && r.EndDate >= startDate) ||
                        (r.StartDate <= endDate && r.EndDate >= endDate) ||
                        (r.StartDate >= startDate && r.EndDate <= endDate)));

        if (excludeRentalId.HasValue)
        {
            query = query.Where(r => r.Id != excludeRentalId.Value);
        }

        return !await query.AnyAsync();
    }
}
