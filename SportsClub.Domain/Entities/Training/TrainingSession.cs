namespace SportsClub.Domain.Entities.Training;

public class TrainingSession : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    // Antrenmanın ait olduğu takım/grup
    public Guid TeamId { get; set; }
    public Team? Team { get; set; }
    
    // Antrenmanı yönetecek antrenör
    public Guid? CoachId { get; set; }
    public AppUser? Coach { get; set; }

    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Location { get; set; } = string.Empty; // Tesis/Saha bilgisi
}
