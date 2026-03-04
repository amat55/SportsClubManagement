using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SportsClub.Domain.Entities.Operations;

namespace SportsClub.Infrastructure.Persistence.Configurations;

public class ShuttleConfiguration : IEntityTypeConfiguration<ShuttleStudent>
{
    public void Configure(EntityTypeBuilder<ShuttleStudent> builder)
    {
        // Composite Key for ShuttleStudent
        builder.HasKey(ss => new { ss.ShuttleId, ss.AthleteId });

        builder.HasOne(ss => ss.Shuttle)
            .WithMany(s => s.ShuttleStudents)
            .HasForeignKey(ss => ss.ShuttleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ss => ss.Athlete)
            .WithMany(a => a.ShuttleStudents)
            .HasForeignKey(ss => ss.AthleteId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
