namespace SportsClub.Domain.Entities.Training;

public class Branch : BaseEntity
{
    public string Name { get; set; } = string.Empty; // Örn: Basketbol, Yüzme, Voleybol
    public string Description { get; set; } = string.Empty;

    // Bir branşta birden çok takım olabilir
    public ICollection<Team> Teams { get; set; } = new List<Team>();
}
