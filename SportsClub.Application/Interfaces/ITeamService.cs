using SportsClub.Application.DTOs.Training;

namespace SportsClub.Application.Interfaces;

public interface ITeamService
{
    Task<IEnumerable<BranchDto>> GetAllBranchesAsync();
    Task<BranchDto> CreateBranchAsync(string name, string description);

    Task<IEnumerable<TeamDto>> GetAllTeamsAsync();
    Task<TeamDto?> GetTeamByIdAsync(Guid id);
    Task<TeamDto> CreateTeamAsync(string name, Guid branchId, Guid? coachId);
    
    Task<bool> AssignCoachToTeamAsync(Guid teamId, Guid coachId);
    Task<bool> AddAthleteToTeamAsync(Guid teamId, Guid athleteId);
    Task<bool> RemoveAthleteFromTeamAsync(Guid teamId, Guid athleteId);
}
