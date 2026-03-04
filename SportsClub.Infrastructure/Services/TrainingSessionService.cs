using Microsoft.EntityFrameworkCore;
using SportsClub.Application.DTOs.Training;
using SportsClub.Application.Interfaces;
using SportsClub.Domain.Entities.Training;
using SportsClub.Infrastructure.Persistence;

namespace SportsClub.Infrastructure.Services;

public class TrainingSessionService : ITrainingSessionService
{
    private readonly ApplicationDbContext _context;

    public TrainingSessionService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TrainingSessionDto>> GetAllSessionsAsync()
    {
        return await _context.TrainingSessions
            .Include(ts => ts.Team)
            .Include(ts => ts.Coach)
            .AsNoTracking()
            .Select(ts => new TrainingSessionDto
            {
                Id = ts.Id,
                Title = ts.Title,
                Description = ts.Description,
                TeamId = ts.TeamId,
                TeamName = ts.Team != null ? ts.Team.Name : string.Empty,
                CoachId = ts.CoachId,
                CoachName = ts.Coach != null ? $"{ts.Coach.FirstName} {ts.Coach.LastName}" : "Atanmadı",
                StartTime = ts.StartTime,
                EndTime = ts.EndTime,
                Location = ts.Location
            }).ToListAsync();
    }

    public async Task<IEnumerable<TrainingSessionDto>> GetSessionsByTeamAsync(Guid teamId)
    {
        return await _context.TrainingSessions
            .Where(ts => ts.TeamId == teamId)
            .Include(ts => ts.Team)
            .Include(ts => ts.Coach)
            .AsNoTracking()
            .Select(ts => new TrainingSessionDto
            {
                Id = ts.Id,
                Title = ts.Title,
                Description = ts.Description,
                TeamId = ts.TeamId,
                TeamName = ts.Team != null ? ts.Team.Name : string.Empty,
                CoachId = ts.CoachId,
                CoachName = ts.Coach != null ? $"{ts.Coach.FirstName} {ts.Coach.LastName}" : "Atanmadı",
                StartTime = ts.StartTime,
                EndTime = ts.EndTime,
                Location = ts.Location
            }).ToListAsync();
    }

    public async Task<TrainingSessionDto> CreateSessionAsync(string title, string description, Guid teamId, Guid? coachId, DateTime startTime, DateTime endTime, string location)
    {
        var session = new TrainingSession
        {
            Title = title,
            Description = description,
            TeamId = teamId,
            CoachId = coachId,
            StartTime = startTime,
            EndTime = endTime,
            Location = location
        };

        _context.TrainingSessions.Add(session);
        await _context.SaveChangesAsync();

        return new TrainingSessionDto
        {
            Id = session.Id,
            Title = session.Title,
            Description = session.Description,
            TeamId = session.TeamId,
            CoachId = session.CoachId,
            StartTime = session.StartTime,
            EndTime = session.EndTime,
            Location = session.Location
        };
    }

    public async Task<bool> DeleteSessionAsync(Guid sessionId)
    {
        var session = await _context.TrainingSessions.FindAsync(sessionId);
        if (session == null) return false;

        _context.TrainingSessions.Remove(session);
        await _context.SaveChangesAsync();
        return true;
    }
}
