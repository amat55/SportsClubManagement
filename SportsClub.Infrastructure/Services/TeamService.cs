using Microsoft.EntityFrameworkCore;
using SportsClub.Application.DTOs.Training;
using SportsClub.Application.Interfaces;
using SportsClub.Domain.Entities.Training;
using SportsClub.Infrastructure.Persistence;

namespace SportsClub.Infrastructure.Services;

public class TeamService : ITeamService
{
    private readonly ApplicationDbContext _context;

    public TeamService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<BranchDto>> GetAllBranchesAsync()
    {
        return await _context.Branches
            .AsNoTracking()
            .Select(b => new BranchDto
            {
                Id = b.Id,
                Name = b.Name,
                Description = b.Description,
                IsActive = b.IsActive
            }).ToListAsync();
    }

    public async Task<BranchDto> CreateBranchAsync(string name, string description)
    {
        var branch = new Branch { Name = name, Description = description };
        _context.Branches.Add(branch);
        await _context.SaveChangesAsync();

        return new BranchDto { Id = branch.Id, Name = branch.Name, Description = branch.Description, IsActive = branch.IsActive };
    }

    public async Task<IEnumerable<TeamDto>> GetAllTeamsAsync()
    {
        return await _context.Teams
            .Include(t => t.Branch)
            .Include(t => t.Coach)
            .Include(t => t.Athletes)
            .AsNoTracking()
            .Select(t => new TeamDto
            {
                Id = t.Id,
                Name = t.Name,
                BranchId = t.BranchId,
                BranchName = t.Branch != null ? t.Branch.Name : string.Empty,
                CoachId = t.CoachId,
                CoachName = t.Coach != null ? $"{t.Coach.FirstName} {t.Coach.LastName}" : "Atanmadı",
                AthleteCount = t.Athletes.Count,
                IsActive = t.IsActive
            }).ToListAsync();
    }

    public async Task<TeamDto?> GetTeamByIdAsync(Guid id)
    {
        var team = await _context.Teams
            .Include(t => t.Branch)
            .Include(t => t.Coach)
            .Include(t => t.Athletes)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (team == null) return null;

        return new TeamDto
        {
            Id = team.Id,
            Name = team.Name,
            BranchId = team.BranchId,
            BranchName = team.Branch != null ? team.Branch.Name : string.Empty,
            CoachId = team.CoachId,
            CoachName = team.Coach != null ? $"{team.Coach.FirstName} {team.Coach.LastName}" : "Atanmadı",
            AthleteCount = team.Athletes.Count,
            IsActive = team.IsActive
        };
    }

    public async Task<TeamDto> CreateTeamAsync(string name, Guid branchId, Guid? coachId)
    {
        var team = new Team
        {
            Name = name,
            BranchId = branchId,
            CoachId = coachId
        };

        _context.Teams.Add(team);
        await _context.SaveChangesAsync();

        return await GetTeamByIdAsync(team.Id) ?? new TeamDto();
    }

    public async Task<bool> AssignCoachToTeamAsync(Guid teamId, Guid coachId)
    {
        var team = await _context.Teams.FindAsync(teamId);
        if (team == null) return false;

        // Gerçek bir senaryoda CoachId'nin gerçekten bir antrenör olup olmadığı rollerden kontrol edilebilir.
        team.CoachId = coachId;
        team.UpdatedAt = DateTime.UtcNow;

        _context.Teams.Update(team);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AddAthleteToTeamAsync(Guid teamId, Guid athleteId)
    {
        var team = await _context.Teams.Include(t => t.Athletes).FirstOrDefaultAsync(t => t.Id == teamId);
        var athlete = await _context.Athletes.FindAsync(athleteId);

        if (team == null || athlete == null) return false;

        if (!team.Athletes.Any(a => a.Id == athleteId))
        {
            team.Athletes.Add(athlete);
            await _context.SaveChangesAsync();
        }

        return true;
    }

    public async Task<bool> RemoveAthleteFromTeamAsync(Guid teamId, Guid athleteId)
    {
        var team = await _context.Teams.Include(t => t.Athletes).FirstOrDefaultAsync(t => t.Id == teamId);
        if (team == null) return false;

        var athlete = team.Athletes.FirstOrDefault(a => a.Id == athleteId);
        if (athlete != null)
        {
            team.Athletes.Remove(athlete);
            await _context.SaveChangesAsync();
            return true;
        }

        return false;
    }
}
