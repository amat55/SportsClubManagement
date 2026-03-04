using Microsoft.EntityFrameworkCore;
using SportsClub.Application.DTOs.Medical;
using SportsClub.Application.Interfaces;
using SportsClub.Domain.Entities.Medical;
using SportsClub.Infrastructure.Persistence;

namespace SportsClub.Infrastructure.Services;

public class MedicalService : IMedicalService
{
    private readonly ApplicationDbContext _context;

    public MedicalService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PhysicalMeasurementDto>> GetMeasurementsByAthleteAsync(Guid athleteId)
    {
        return await _context.Set<PhysicalMeasurement>()
            .Where(m => m.AthleteId == athleteId)
            .OrderByDescending(m => m.MeasurementDate)
            .AsNoTracking()
            .Select(m => new PhysicalMeasurementDto
            {
                Id = m.Id,
                AthleteId = m.AthleteId,
                MeasurementDate = m.MeasurementDate,
                Height = m.Height,
                Weight = m.Weight,
                ArmSpan = m.ArmSpan,
                BodyFatPercentage = m.BodyFatPercentage,
                FlexibilityScore = m.FlexibilityScore,
                JumpHeight = m.JumpHeight,
                Notes = m.Notes
            }).ToListAsync();
    }

    public async Task<PhysicalMeasurementDto> AddMeasurementAsync(CreatePhysicalMeasurementDto model)
    {
        var measurement = new PhysicalMeasurement
        {
            AthleteId = model.AthleteId,
            MeasurementDate = model.MeasurementDate.ToUniversalTime(),
            Height = model.Height,
            Weight = model.Weight,
            ArmSpan = model.ArmSpan,
            BodyFatPercentage = model.BodyFatPercentage,
            FlexibilityScore = model.FlexibilityScore,
            JumpHeight = model.JumpHeight,
            Notes = model.Notes
        };

        _context.Set<PhysicalMeasurement>().Add(measurement);
        await _context.SaveChangesAsync();

        return new PhysicalMeasurementDto
        {
            Id = measurement.Id,
            AthleteId = measurement.AthleteId,
            MeasurementDate = measurement.MeasurementDate,
            Height = measurement.Height,
            Weight = measurement.Weight,
            ArmSpan = measurement.ArmSpan,
            BodyFatPercentage = measurement.BodyFatPercentage,
            FlexibilityScore = measurement.FlexibilityScore,
            JumpHeight = measurement.JumpHeight,
            Notes = measurement.Notes
        };
    }

    public async Task<bool> DeleteMeasurementAsync(Guid id)
    {
        var measurement = await _context.Set<PhysicalMeasurement>().FindAsync(id);
        if (measurement == null) return false;

        _context.Set<PhysicalMeasurement>().Remove(measurement);
        await _context.SaveChangesAsync();
        
        return true;
    }
}
