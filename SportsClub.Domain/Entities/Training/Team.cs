namespace SportsClub.Domain.Entities.Training;

public class Team : BaseEntity
{
    public string Name { get; set; } = string.Empty; // Örn: Basketbol U12, Yüzme İleri Seviye
    
    public Guid BranchId { get; set; }
    public Branch? Branch { get; set; }

    // Takımın Antrenörü (Koç)
    public Guid? CoachId { get; set; }
    public AppUser? Coach { get; set; }

    // Takıma kayıtlı sporcular
    public ICollection<Athlete> Athletes { get; set; } = new List<Athlete>();
    
    // Takımın antrenman programları
    public ICollection<TrainingSession> TrainingSessions { get; set; } = new List<TrainingSession>();
}
