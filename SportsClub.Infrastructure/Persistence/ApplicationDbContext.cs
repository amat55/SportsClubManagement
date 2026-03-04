using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SportsClub.Domain.Entities;

using SportsClub.Domain.Entities.Training;
using System.Reflection;

namespace SportsClub.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>
{
    public DbSet<Athlete> Athletes { get; set; }
    public DbSet<Parent> Parents { get; set; }
    public DbSet<Branch> Branches { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<TrainingSession> TrainingSessions { get; set; }
    public DbSet<SportsClub.Domain.Entities.Operations.Attendance> Attendances { get; set; }
    public DbSet<SportsClub.Domain.Entities.Accounting.Payment> Payments { get; set; }
    public DbSet<SportsClub.Domain.Entities.Medical.PhysicalMeasurement> PhysicalMeasurements { get; set; }
    
    public DbSet<SportsClub.Domain.Entities.Operations.Shuttle> Shuttles { get; set; }
    public DbSet<SportsClub.Domain.Entities.Operations.ShuttleStudent> ShuttleStudents { get; set; }
    public DbSet<SportsClub.Domain.Entities.Communication.Message> Messages { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Özelleştirilmiş tablo isimleri (Identity varsayılan AspNet... tablolarını yeniden isimlendirme)
        builder.Entity<AppUser>().ToTable("Users");
        builder.Entity<IdentityRole<Guid>>().ToTable("Roles");
        builder.Entity<IdentityUserRole<Guid>>().ToTable("UserRoles");
        builder.Entity<IdentityUserClaim<Guid>>().ToTable("UserClaims");
        builder.Entity<IdentityUserLogin<Guid>>().ToTable("UserLogins");
        builder.Entity<IdentityRoleClaim<Guid>>().ToTable("RoleClaims");
        builder.Entity<IdentityUserToken<Guid>>().ToTable("UserTokens");

        // Konfigürasyon dosyalarını otomatik bul ve ekle
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
