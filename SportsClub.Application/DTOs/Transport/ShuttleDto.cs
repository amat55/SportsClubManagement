namespace SportsClub.Application.DTOs.Transport;

public class ShuttleDto
{
    public Guid Id { get; set; }
    public string LicensePlate { get; set; } = string.Empty;
    public string DriverName { get; set; } = string.Empty;
    public string DriverPhone { get; set; } = string.Empty;
    public string RouteName { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public int EnrolledStudentCount { get; set; }
}
