namespace SportsClub.Application.DTOs.Medical;

public class CreatePhysicalMeasurementDto
{
    public Guid AthleteId { get; set; }
    public DateTime MeasurementDate { get; set; }
    public double Height { get; set; }
    public double Weight { get; set; }
    public double? ArmSpan { get; set; }
    public double? BodyFatPercentage { get; set; }
    public double? FlexibilityScore { get; set; }
    public double? JumpHeight { get; set; }
    public string Notes { get; set; } = string.Empty;
}
