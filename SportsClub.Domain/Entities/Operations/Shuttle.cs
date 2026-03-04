namespace SportsClub.Domain.Entities.Operations;

public class Shuttle : BaseEntity
{
    public string LicensePlate { get; set; } = string.Empty;
    public string DriverName { get; set; } = string.Empty;
    public string DriverPhone { get; set; } = string.Empty;
    public string RouteName { get; set; } = string.Empty; // Örn: Kadıköy-Bostancı Güzergahı
    public int Capacity { get; set; }
    
    // Servise kayıtlı öğrenciler
    public ICollection<ShuttleStudent> ShuttleStudents { get; set; } = new List<ShuttleStudent>();
}
