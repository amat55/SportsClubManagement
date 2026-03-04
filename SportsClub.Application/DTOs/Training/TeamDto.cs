namespace SportsClub.Application.DTOs.Training;

public class TeamDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    
    public Guid? CoachId { get; set; }
    public string CoachName { get; set; } = string.Empty;
    
    public int AthleteCount { get; set; }
    public bool IsActive { get; set; }
}
