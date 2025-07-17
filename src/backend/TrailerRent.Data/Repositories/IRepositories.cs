using TrailerRent.Models.Entities;

namespace TrailerRent.Data.Repositories;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByEmailAsync(string email);
    Task<User> CreateAsync(User user);
    Task<User> UpdateAsync(User user);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task<bool> EmailExistsAsync(string email);
}

public interface ITrailerRepository
{
    Task<IEnumerable<Trailer>> GetAllAsync();
    Task<Trailer?> GetByIdAsync(int id);
    Task<IEnumerable<Trailer>> GetAvailableAsync();
    Task<IEnumerable<Trailer>> GetAvailableForDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<Trailer> CreateAsync(Trailer trailer);
    Task<Trailer> UpdateAsync(Trailer trailer);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}

public interface IRentalRepository
{
    Task<IEnumerable<Rental>> GetAllAsync();
    Task<Rental?> GetByIdAsync(int id);
    Task<IEnumerable<Rental>> GetByUserIdAsync(int userId);
    Task<IEnumerable<Rental>> GetByTrailerIdAsync(int trailerId);
    Task<Rental> CreateAsync(Rental rental);
    Task<Rental> UpdateAsync(Rental rental);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task<bool> IsTrailerAvailableAsync(int trailerId, DateTime startDate, DateTime endDate, int? excludeRentalId = null);
}
