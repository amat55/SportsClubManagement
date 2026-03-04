namespace SportsClub.Application.DTOs.Operations;

public class AttendanceDto
{
    public Guid Id { get; set; }
    public Guid TrainingSessionId { get; set; }
    public string TrainingSessionTitle { get; set; } = string.Empty;
    public Guid AthleteId { get; set; }
    public string AthleteFullName { get; set; } = string.Empty;
    public bool IsPresent { get; set; }
    public string ExcuseNote { get; set; } = string.Empty;
}
