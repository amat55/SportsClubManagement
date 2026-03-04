using SportsClub.Application.DTOs.Transport;

namespace SportsClub.Application.Interfaces;

public interface IShuttleService
{
    Task<IEnumerable<ShuttleDto>> GetAllShuttlesAsync();
    Task<ShuttleDto> CreateShuttleAsync(string licensePlate, string driverName, string driverPhone, string routeName, int capacity);
    Task<bool> EnrollStudentAsync(Guid shuttleId, EnrollStudentDto model);
    Task<bool> RemoveStudentAsync(Guid shuttleId, Guid athleteId);
}
