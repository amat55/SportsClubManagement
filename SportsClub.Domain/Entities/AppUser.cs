using Microsoft.AspNetCore.Identity;

namespace SportsClub.Domain.Entities;

public class AppUser : IdentityUser<Guid>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    
    // Antrenör, Kurum Yöneticisi, Veli gibi rolleri ayırt etmek veya ekstra bilgileri bağlamak için
    // Navigation Property olarak eklenecek olan UserProfile veya spesifik varlıklarla ilişki kurulabilir.
    
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
