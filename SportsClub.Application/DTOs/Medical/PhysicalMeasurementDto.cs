namespace SportsClub.Application.DTOs.Medical;

public class PhysicalMeasurementDto
{
    public Guid Id { get; set; }
    public Guid AthleteId { get; set; }
    public DateTime MeasurementDate { get; set; }
    public double Height { get; set; } // Boy (cm)
    public double Weight { get; set; } // Kilo (kg)
    public double? ArmSpan { get; set; } // Kulaç uzunluğu
    public double? BodyFatPercentage { get; set; } // Yağ oranı
    public double? FlexibilityScore { get; set; } // Esneklik Skoru
    public double? JumpHeight { get; set; } // Sırama yüksekliği
    public string Notes { get; set; } = string.Empty;
}
