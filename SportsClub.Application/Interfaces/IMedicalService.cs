using SportsClub.Application.DTOs.Medical;

namespace SportsClub.Application.Interfaces;

public interface IMedicalService
{
    Task<IEnumerable<PhysicalMeasurementDto>> GetMeasurementsByAthleteAsync(Guid athleteId);
    Task<PhysicalMeasurementDto> AddMeasurementAsync(CreatePhysicalMeasurementDto model);
    Task<bool> DeleteMeasurementAsync(Guid id);
}
