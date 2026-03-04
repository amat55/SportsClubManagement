using SportsClub.Domain.Entities.Training;

namespace SportsClub.Domain.Entities.Operations;

public class Attendance : BaseEntity
{
    // Hangi antrenman oturumuna ait olduğu
    public Guid TrainingSessionId { get; set; }
    public TrainingSession? TrainingSession { get; set; }

    // Hangi sporcu için tutulduğu
    public Guid AthleteId { get; set; }
    public Athlete? Athlete { get; set; }

    // Katılım durumu
    public bool IsPresent { get; set; } = false;

    // Varsa mazeret açıklaması (Örn: "Doktor randevusu vardı", "Okul sınavı")
    public string ExcuseNote { get; set; } = string.Empty;
}
