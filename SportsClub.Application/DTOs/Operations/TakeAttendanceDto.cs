namespace SportsClub.Application.DTOs.Operations;

public class TakeAttendanceDto
{
    public Guid TrainingSessionId { get; set; }
    public Guid AthleteId { get; set; }
    public bool IsPresent { get; set; }
    public string ExcuseNote { get; set; } = string.Empty;
}
