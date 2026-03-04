using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SportsClub.Domain.Entities;
using SportsClub.Domain.Entities.Training;

namespace SportsClub.Infrastructure.Persistence.Configurations;

public class TeamConfiguration : IEntityTypeConfiguration<Team>
{
    public void Configure(EntityTypeBuilder<Team> builder)
    {
        // Athlete - Team Çoktan Çoğa (Many-to-Many) İlişkisi 
        builder.HasMany(t => t.Athletes)
            .WithMany(a => a.Teams)
            .UsingEntity<Dictionary<string, object>>(
                "TeamAthlete", // Ara tablo ismi
                j => j.HasOne<Athlete>().WithMany().HasForeignKey("AthleteId"),
                j => j.HasOne<Team>().WithMany().HasForeignKey("TeamId")
            );
    }
}
