using SportsClub.Application.DTOs.Training;

namespace SportsClub.Application.Interfaces;

public interface ITrainingSessionService
{
    Task<IEnumerable<TrainingSessionDto>> GetAllSessionsAsync();
    Task<IEnumerable<TrainingSessionDto>> GetSessionsByTeamAsync(Guid teamId);
    Task<TrainingSessionDto> CreateSessionAsync(string title, string description, Guid teamId, Guid? coachId, DateTime startTime, DateTime endTime, string location);
    Task<bool> DeleteSessionAsync(Guid sessionId);
}
