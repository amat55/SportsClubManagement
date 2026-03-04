namespace SportsClub.Domain.Entities.Operations;

public class ShuttleStudent
{
    public Guid ShuttleId { get; set; }
    public Shuttle? Shuttle { get; set; }

    public Guid AthleteId { get; set; }
    public Athlete? Athlete { get; set; }

    public string PickUpDropOffPoint { get; set; } = string.Empty; // İniş/Biniş noktası
    public bool IsActive { get; set; } = true;
}
