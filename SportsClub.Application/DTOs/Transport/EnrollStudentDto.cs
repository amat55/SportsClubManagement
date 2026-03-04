namespace SportsClub.Application.DTOs.Transport;

public class EnrollStudentDto
{
    public Guid AthleteId { get; set; }
    public string PickUpDropOffPoint { get; set; } = string.Empty;
}
