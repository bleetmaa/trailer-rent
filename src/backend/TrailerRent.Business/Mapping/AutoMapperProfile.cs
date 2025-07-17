using AutoMapper;
using TrailerRent.Models.DTOs;
using TrailerRent.Models.Entities;

namespace TrailerRent.Business.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User mappings
        CreateMap<User, UserDto>();
        CreateMap<RegisterDto, User>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt => opt.Ignore())
            .ForMember(dest => dest.Rentals, opt => opt.Ignore());

        // Trailer mappings
        CreateMap<Trailer, TrailerDto>()
            .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.Images));
        CreateMap<CreateTrailerDto, Trailer>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.IsAvailable, opt => opt.MapFrom(src => true))
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Images, opt => opt.Ignore())
            .ForMember(dest => dest.Rentals, opt => opt.Ignore());

        // Trailer Image mappings
        CreateMap<TrailerImage, TrailerImageDto>();

        // Rental mappings
        CreateMap<Rental, RentalDto>()
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
            .ForMember(dest => dest.Trailer, opt => opt.MapFrom(src => src.Trailer));
        CreateMap<CreateRentalDto, Rental>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Trailer, opt => opt.Ignore())
            .ForMember(dest => dest.TotalPrice, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => RentalStatus.Pending))
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());
    }
}
