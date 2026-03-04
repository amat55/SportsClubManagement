using SportsClub.Application.DTOs.Athlete;

namespace SportsClub.Application.Interfaces;

public interface IAthleteService
{
    Task<IEnumerable<AthleteDto>> GetAllAthletesAsync();
    Task<AthleteDto?> GetAthleteByIdAsync(Guid id);
    Task<AthleteDto> CreateAthleteAsync(CreateAthleteDto createAthleteDto);
    Task<bool> ToggleAthleteStatusAsync(Guid id); // Aktif/Pasif Yapma İsteneği
    Task<bool> DeleteAthleteAsync(Guid id);
}
