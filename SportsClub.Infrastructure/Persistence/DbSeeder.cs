using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SportsClub.Domain.Entities;

namespace SportsClub.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        var logger = serviceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DbSeeder");

        try
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<AppUser>>();

            string[] roles = { "Admin", "Antrenör", "Veli", "Sporcu" };

            // Seed Roles
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    logger.LogInformation("Rol oluşturuluyor: {Role}", role);
                    await roleManager.CreateAsync(new IdentityRole<Guid> { Name = role });
                }
            }

            // Seed Admin User
            string adminEmail = "admin@sportsclub.com";
            if (await userManager.FindByEmailAsync(adminEmail) == null)
            {
                logger.LogInformation("Admin kullanıcısı oluşturuluyor...");
                var adminUser = new AppUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FirstName = "Sistem",
                    LastName = "Yöneticisi",
                    EmailConfirmed = true
                };

                // Admin123! gibi varsayılan güçlü bir şifre oluşturalım
                var result = await userManager.CreateAsync(adminUser, "Admin123!");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                    logger.LogInformation("Admin kullanıcısı yaratıldı ve Admin rolü atandı.");
                }
                else
                {
                    logger.LogError("Admin oluşturulurken hata: {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Veritabanı seed işlemi sırasında bir hata oluştu!");
        }
    }
}
