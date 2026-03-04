using Microsoft.EntityFrameworkCore;
using SportsClub.Application.DTOs.Operations;
using SportsClub.Application.Interfaces;
using SportsClub.Domain.Entities.Operations;
using SportsClub.Infrastructure.Persistence;

namespace SportsClub.Infrastructure.Services;

public class AttendanceService : IAttendanceService
{
    private readonly ApplicationDbContext _context;

    public AttendanceService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<AttendanceDto>> GetAttendanceBySessionAsync(Guid trainingSessionId)
    {
        return await _context.Attendances
            .Include(a => a.TrainingSession)
            .Include(a => a.Athlete)
            .Where(a => a.TrainingSessionId == trainingSessionId)
            .AsNoTracking()
            .Select(a => new AttendanceDto
            {
                Id = a.Id,
                TrainingSessionId = a.TrainingSessionId,
                TrainingSessionTitle = a.TrainingSession != null ? a.TrainingSession.Title : string.Empty,
                AthleteId = a.AthleteId,
                AthleteFullName = a.Athlete != null ? $"{a.Athlete.FirstName} {a.Athlete.LastName}" : string.Empty,
                IsPresent = a.IsPresent,
                ExcuseNote = a.ExcuseNote
            }).ToListAsync();
    }

    public async Task<IEnumerable<AttendanceDto>> GetAttendanceByAthleteAsync(Guid athleteId)
    {
        return await _context.Attendances
            .Include(a => a.TrainingSession)
            .Where(a => a.AthleteId == athleteId)
            .AsNoTracking()
            .Select(a => new AttendanceDto
            {
                Id = a.Id,
                TrainingSessionId = a.TrainingSessionId,
                TrainingSessionTitle = a.TrainingSession != null ? a.TrainingSession.Title : string.Empty,
                AthleteId = a.AthleteId,
                IsPresent = a.IsPresent,
                ExcuseNote = a.ExcuseNote
            }).ToListAsync();
    }

    public async Task<bool> TakeOrUpdateAttendanceAsync(TakeAttendanceDto request)
    {
        // Aynı sporcunun aynı antrenmana aidiyeti
        var existingAttendance = await _context.Attendances
            .FirstOrDefaultAsync(a => a.TrainingSessionId == request.TrainingSessionId && a.AthleteId == request.AthleteId);

        if (existingAttendance != null)
        {
            // Varsa Güncelle (Update)
            existingAttendance.IsPresent = request.IsPresent;
            existingAttendance.ExcuseNote = request.ExcuseNote;
            existingAttendance.UpdatedAt = DateTime.UtcNow;
            
            _context.Attendances.Update(existingAttendance);
        }
        else
        {
            // Yoksa Yeni Kayıt (Insert)
            var newAttendance = new Attendance
            {
                TrainingSessionId = request.TrainingSessionId,
                AthleteId = request.AthleteId,
                IsPresent = request.IsPresent,
                ExcuseNote = request.ExcuseNote
            };
            
            _context.Attendances.Add(newAttendance);
        }

        await _context.SaveChangesAsync();
        return true;
    }
}
