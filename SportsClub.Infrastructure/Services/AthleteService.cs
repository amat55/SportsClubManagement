using Microsoft.EntityFrameworkCore;
using SportsClub.Application.DTOs.Athlete;
using SportsClub.Application.Interfaces;
using SportsClub.Domain.Entities;
using SportsClub.Infrastructure.Persistence;

namespace SportsClub.Infrastructure.Services;

public class AthleteService : IAthleteService
{
    private readonly ApplicationDbContext _context;

    public AthleteService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<AthleteDto>> GetAllAthletesAsync()
    {
        return await _context.Athletes
            .AsNoTracking()
            .OrderByDescending(a => a.RegistrationDate)
            .Select(a => new AthleteDto
            {
                Id = a.Id,
                FirstName = a.FirstName,
                LastName = a.LastName,
                PhoneNumber = a.PhoneNumber,
                DateOfBirth = a.DateOfBirth,
                BloodType = a.BloodType.ToString(),
                Height = a.Height,
                Weight = a.Weight,
                Address = a.Address,
                EmergencyContactName = a.EmergencyContactName,
                EmergencyContactPhone = a.EmergencyContactPhone,
                EmergencyContactRelation = a.EmergencyContactRelation,
                MotherName = a.MotherName,
                FatherName = a.FatherName,
                IsActive = a.IsActive,
                RegistrationDate = a.RegistrationDate
            }).ToListAsync();
    }

    public async Task<AthleteDto?> GetAthleteByIdAsync(Guid id)
    {
        var athlete = await _context.Athletes.FindAsync(id);
        if (athlete == null) return null;

        return new AthleteDto
        {
            Id = athlete.Id,
            FirstName = athlete.FirstName,
            LastName = athlete.LastName,
            PhoneNumber = athlete.PhoneNumber,
            DateOfBirth = athlete.DateOfBirth,
            BloodType = athlete.BloodType.ToString(),
            Height = athlete.Height,
            Weight = athlete.Weight,
            Address = athlete.Address,
            EmergencyContactName = athlete.EmergencyContactName,
            EmergencyContactPhone = athlete.EmergencyContactPhone,
            EmergencyContactRelation = athlete.EmergencyContactRelation,
            MotherName = athlete.MotherName,
            FatherName = athlete.FatherName,
            IsActive = athlete.IsActive,
            RegistrationDate = athlete.RegistrationDate
        };
    }

    public async Task<AthleteDto> CreateAthleteAsync(CreateAthleteDto dto)
    {
        var athlete = new Athlete
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            MotherName = dto.MotherName,
            FatherName = dto.FatherName,
            SchoolName = dto.SchoolName,
            Grade = dto.Grade,
            DateOfBirth = DateTime.SpecifyKind(dto.DateOfBirth, DateTimeKind.Utc),
            PlaceOfBirth = dto.PlaceOfBirth,
            Address = dto.Address,
            PhoneNumber = dto.PhoneNumber,
            BloodType = dto.BloodType,
            RegularMedications = dto.RegularMedications,
            ChronicDiseases = dto.ChronicDiseases,
            Height = dto.Height,
            Weight = dto.Weight,
            ShoeSize = dto.ShoeSize,
            EmergencyContactName = dto.EmergencyContactName,
            EmergencyContactPhone = dto.EmergencyContactPhone,
            EmergencyContactRelation = dto.EmergencyContactRelation,
            IsActive = true
        };

        _context.Athletes.Add(athlete);
        await _context.SaveChangesAsync();

        return new AthleteDto
        {
            Id = athlete.Id,
            FirstName = athlete.FirstName,
            LastName = athlete.LastName,
            PhoneNumber = athlete.PhoneNumber,
            DateOfBirth = athlete.DateOfBirth,
            BloodType = athlete.BloodType.ToString(),
            Height = athlete.Height,
            Weight = athlete.Weight,
            Address = athlete.Address,
            EmergencyContactName = athlete.EmergencyContactName,
            EmergencyContactPhone = athlete.EmergencyContactPhone,
            EmergencyContactRelation = athlete.EmergencyContactRelation,
            MotherName = athlete.MotherName,
            FatherName = athlete.FatherName,
            IsActive = athlete.IsActive,
            RegistrationDate = athlete.RegistrationDate
        };
    }

    public async Task<bool> ToggleAthleteStatusAsync(Guid id)
    {
        var athlete = await _context.Athletes.FindAsync(id);
        if (athlete == null) return false;

        athlete.IsActive = !athlete.IsActive; // Durumu tersine çevir
        athlete.UpdatedAt = DateTime.UtcNow;

        _context.Athletes.Update(athlete);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAthleteAsync(Guid id)
    {
        var athlete = await _context.Athletes.FindAsync(id);
        if (athlete == null) return false;

        _context.Athletes.Remove(athlete);
        await _context.SaveChangesAsync();
        return true;
    }
}
