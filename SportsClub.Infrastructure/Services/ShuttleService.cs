using Microsoft.EntityFrameworkCore;
using SportsClub.Application.DTOs.Transport;
using SportsClub.Application.Interfaces;
using SportsClub.Domain.Entities.Operations;
using SportsClub.Infrastructure.Persistence;

namespace SportsClub.Infrastructure.Services;

public class ShuttleService : IShuttleService
{
    private readonly ApplicationDbContext _context;

    public ShuttleService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ShuttleDto>> GetAllShuttlesAsync()
    {
        return await _context.Shuttles
            .Include(s => s.ShuttleStudents)
            .AsNoTracking()
            .Select(s => new ShuttleDto
            {
                Id = s.Id,
                LicensePlate = s.LicensePlate,
                DriverName = s.DriverName,
                DriverPhone = s.DriverPhone,
                RouteName = s.RouteName,
                Capacity = s.Capacity,
                EnrolledStudentCount = s.ShuttleStudents.Count
            }).ToListAsync();
    }

    public async Task<ShuttleDto> CreateShuttleAsync(string licensePlate, string driverName, string driverPhone, string routeName, int capacity)
    {
        var shuttle = new Shuttle
        {
            LicensePlate = licensePlate,
            DriverName = driverName,
            DriverPhone = driverPhone,
            RouteName = routeName,
            Capacity = capacity
        };

        _context.Shuttles.Add(shuttle);
        await _context.SaveChangesAsync();

        return new ShuttleDto
        {
            Id = shuttle.Id,
            LicensePlate = shuttle.LicensePlate,
            DriverName = shuttle.DriverName,
            DriverPhone = shuttle.DriverPhone,
            RouteName = shuttle.RouteName,
            Capacity = shuttle.Capacity,
            EnrolledStudentCount = 0
        };
    }

    public async Task<bool> EnrollStudentAsync(Guid shuttleId, EnrollStudentDto model)
    {
        var shuttle = await _context.Shuttles
            .Include(s => s.ShuttleStudents)
            .FirstOrDefaultAsync(s => s.Id == shuttleId);

        if (shuttle == null) return false;
        if (shuttle.ShuttleStudents.Count >= shuttle.Capacity) return false; // Kapasite dolu kontrolü
        
        // Zaten kayıtlı mı kontrol et
        if (shuttle.ShuttleStudents.Any(ss => ss.AthleteId == model.AthleteId)) return true;

        var student = new ShuttleStudent
        {
            ShuttleId = shuttle.Id,
            AthleteId = model.AthleteId,
            PickUpDropOffPoint = model.PickUpDropOffPoint,
            IsActive = true
        };

        _context.ShuttleStudents.Add(student);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveStudentAsync(Guid shuttleId, Guid athleteId)
    {
        var shuttleStudent = await _context.ShuttleStudents
            .FirstOrDefaultAsync(ss => ss.ShuttleId == shuttleId && ss.AthleteId == athleteId);

        if (shuttleStudent == null) return false;

        _context.ShuttleStudents.Remove(shuttleStudent);
        await _context.SaveChangesAsync();
        return true;
    }
}
