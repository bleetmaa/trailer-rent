using AutoMapper;
using TrailerRent.Business.Exceptions;
using TrailerRent.Data.Repositories;
using TrailerRent.Models.DTOs;
using TrailerRent.Models.Entities;

namespace TrailerRent.Business.Services;

public class RentalService : IRentalService
{
    private readonly IRentalRepository _rentalRepository;
    private readonly ITrailerRepository _trailerRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public RentalService(
        IRentalRepository rentalRepository, 
        ITrailerRepository trailerRepository,
        IUserRepository userRepository,
        IMapper mapper)
    {
        _rentalRepository = rentalRepository;
        _trailerRepository = trailerRepository;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<RentalDto>> GetAllAsync()
    {
        var rentals = await _rentalRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<RentalDto>>(rentals);
    }

    public async Task<RentalDto?> GetByIdAsync(int id)
    {
        var rental = await _rentalRepository.GetByIdAsync(id);
        return rental != null ? _mapper.Map<RentalDto>(rental) : null;
    }

    public async Task<IEnumerable<RentalDto>> GetUserRentalsAsync(int userId)
    {
        var rentals = await _rentalRepository.GetByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<RentalDto>>(rentals);
    }

    public async Task<RentalDto> CreateAsync(int userId, CreateRentalDto createRentalDto)
    {
        // Validate user exists
        if (!await _userRepository.ExistsAsync(userId))
        {
            throw new NotFoundException("User not found");
        }

        // Validate trailer exists
        var trailer = await _trailerRepository.GetByIdAsync(createRentalDto.TrailerId);
        if (trailer == null)
        {
            throw new NotFoundException("Trailer not found");
        }

        // Validate dates
        if (createRentalDto.StartDate >= createRentalDto.EndDate)
        {
            throw new ValidationException("Start date must be before end date");
        }

        if (createRentalDto.StartDate < DateTime.Today)
        {
            throw new ValidationException("Start date cannot be in the past");
        }

        // Check availability
        if (!await _rentalRepository.IsTrailerAvailableAsync(
            createRentalDto.TrailerId, 
            createRentalDto.StartDate, 
            createRentalDto.EndDate))
        {
            throw new ConflictException("Trailer is not available for the selected dates");
        }

        var rental = _mapper.Map<Rental>(createRentalDto);
        rental.UserId = userId;
        
        // Calculate total price
        var days = (createRentalDto.EndDate - createRentalDto.StartDate).Days;
        if (days == 0) days = 1; // Minimum 1 day
        rental.TotalPrice = trailer.PricePerDay * days;

        var createdRental = await _rentalRepository.CreateAsync(rental);
        return _mapper.Map<RentalDto>(createdRental);
    }

    public async Task<RentalDto> UpdateStatusAsync(int id, UpdateRentalStatusDto updateStatusDto)
    {
        var rental = await _rentalRepository.GetByIdAsync(id);
        if (rental == null)
        {
            throw new NotFoundException("Rental not found");
        }

        rental.Status = updateStatusDto.Status;
        var updatedRental = await _rentalRepository.UpdateAsync(rental);
        return _mapper.Map<RentalDto>(updatedRental);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        if (!await _rentalRepository.ExistsAsync(id))
        {
            throw new NotFoundException("Rental not found");
        }

        return await _rentalRepository.DeleteAsync(id);
    }
}
