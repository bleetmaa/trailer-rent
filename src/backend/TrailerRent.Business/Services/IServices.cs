using TrailerRent.Models.DTOs;

namespace TrailerRent.Business.Services;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
    Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
    Task<UserDto?> GetCurrentUserAsync(int userId);
}

public interface ITrailerService
{
    Task<IEnumerable<TrailerDto>> GetAllAsync();
    Task<TrailerDto?> GetByIdAsync(int id);
    Task<IEnumerable<TrailerDto>> GetAvailableAsync();
    Task<IEnumerable<TrailerDto>> GetAvailableForDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<TrailerDto> CreateAsync(CreateTrailerDto createTrailerDto);
    Task<TrailerDto> UpdateAsync(int id, CreateTrailerDto updateTrailerDto);
    Task<bool> DeleteAsync(int id);
}

public interface IRentalService
{
    Task<IEnumerable<RentalDto>> GetAllAsync();
    Task<RentalDto?> GetByIdAsync(int id);
    Task<IEnumerable<RentalDto>> GetUserRentalsAsync(int userId);
    Task<RentalDto> CreateAsync(int userId, CreateRentalDto createRentalDto);
    Task<RentalDto> UpdateStatusAsync(int id, UpdateRentalStatusDto updateStatusDto);
    Task<bool> DeleteAsync(int id);
}
