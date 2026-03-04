namespace SportsClub.Domain.Entities;

public class Parent : BaseEntity
{
    // Ebeveyn eğer sisteme giriş yapacaksa (veliler uygulamayı kullanabilir dendi) AppUser ile ilişkilendirilir.
    public Guid? UserId { get; set; }
    public AppUser? User { get; set; }

    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Profession { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;

    // Acil durum 3. kişi bilgileri
    public string EmergencyContactName { get; set; } = string.Empty;
    public string EmergencyContactPhone { get; set; } = string.Empty;

    // Ebeveynin sporcuları (Birden fazla çocuğu kulüpte olabilir)
    public ICollection<Athlete> Athletes { get; set; } = new List<Athlete>();
}
