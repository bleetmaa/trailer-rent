using AutoMapper;
using TrailerRent.Business.Exceptions;
using TrailerRent.Data.Repositories;
using TrailerRent.Models.DTOs;
using TrailerRent.Models.Entities;

namespace TrailerRent.Business.Services;

public class TrailerService : ITrailerService
{
    private readonly ITrailerRepository _trailerRepository;
    private readonly IMapper _mapper;

    public TrailerService(ITrailerRepository trailerRepository, IMapper mapper)
    {
        _trailerRepository = trailerRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<TrailerDto>> GetAllAsync()
    {
        var trailers = await _trailerRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<TrailerDto>>(trailers);
    }

    public async Task<TrailerDto?> GetByIdAsync(int id)
    {
        var trailer = await _trailerRepository.GetByIdAsync(id);
        return trailer != null ? _mapper.Map<TrailerDto>(trailer) : null;
    }

    public async Task<IEnumerable<TrailerDto>> GetAvailableAsync()
    {
        var trailers = await _trailerRepository.GetAvailableAsync();
        return _mapper.Map<IEnumerable<TrailerDto>>(trailers);
    }

    public async Task<IEnumerable<TrailerDto>> GetAvailableForDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        if (startDate >= endDate)
        {
            throw new ValidationException("Start date must be before end date");
        }

        if (startDate < DateTime.Today)
        {
            throw new ValidationException("Start date cannot be in the past");
        }

        var trailers = await _trailerRepository.GetAvailableForDateRangeAsync(startDate, endDate);
        return _mapper.Map<IEnumerable<TrailerDto>>(trailers);
    }

    public async Task<TrailerDto> CreateAsync(CreateTrailerDto createTrailerDto)
    {
        var trailer = _mapper.Map<Trailer>(createTrailerDto);
        var createdTrailer = await _trailerRepository.CreateAsync(trailer);
        return _mapper.Map<TrailerDto>(createdTrailer);
    }

    public async Task<TrailerDto> UpdateAsync(int id, CreateTrailerDto updateTrailerDto)
    {
        var existingTrailer = await _trailerRepository.GetByIdAsync(id);
        if (existingTrailer == null)
        {
            throw new NotFoundException("Trailer not found");
        }

        // Update properties
        existingTrailer.Name = updateTrailerDto.Name;
        existingTrailer.Description = updateTrailerDto.Description;
        existingTrailer.Type = updateTrailerDto.Type;
        existingTrailer.PricePerDay = updateTrailerDto.PricePerDay;
        existingTrailer.MaxWeight = updateTrailerDto.MaxWeight;
        existingTrailer.LicensePlate = updateTrailerDto.LicensePlate;

        var updatedTrailer = await _trailerRepository.UpdateAsync(existingTrailer);
        return _mapper.Map<TrailerDto>(updatedTrailer);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        if (!await _trailerRepository.ExistsAsync(id))
        {
            throw new NotFoundException("Trailer not found");
        }

        return await _trailerRepository.DeleteAsync(id);
    }
}
