using SportsClub.Application.DTOs.Operations;

namespace SportsClub.Application.Interfaces;

public interface IAttendanceService
{
    Task<IEnumerable<AttendanceDto>> GetAttendanceBySessionAsync(Guid trainingSessionId);
    Task<IEnumerable<AttendanceDto>> GetAttendanceByAthleteAsync(Guid athleteId);
    
    // Toplu veya tekil yoklama girişi
    Task<bool> TakeOrUpdateAttendanceAsync(TakeAttendanceDto request);
}
