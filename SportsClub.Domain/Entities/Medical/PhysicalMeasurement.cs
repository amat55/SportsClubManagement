namespace SportsClub.Domain.Entities.Medical;

public class PhysicalMeasurement : BaseEntity
{
    public Guid AthleteId { get; set; }
    public Athlete? Athlete { get; set; }

    public DateTime MeasurementDate { get; set; }
    
    // Temel Ölçümler
    public double Height { get; set; } // Boy (cm)
    public double Weight { get; set; } // Kilo (kg)
    
    // Gelişmiş Ölçümler (Opsiyonel)
    public double? ArmSpan { get; set; } // Kulaç uzunluğu (cm) - Özellikle yüzme ve basketbolda önemli
    public double? BodyFatPercentage { get; set; } // Yağ Oranı (%)
    public double? FlexibilityScore { get; set; } // Esneklik (Otur-Uzan testi vs.)
    public double? JumpHeight { get; set; } // Dikey sıçrama (cm)
    
    // Özel notlar (Diyetisyen önerileri vb.)
    public string Notes { get; set; } = string.Empty;
}
