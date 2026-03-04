using SportsClub.Domain.Enums;

namespace SportsClub.Domain.Entities;

public class Athlete : BaseEntity
{
    // Sporcu sisteme giriş yapacaksa
    public Guid? UserId { get; set; }
    public AppUser? User { get; set; }

    // Ebeveyn bağlantısı
    public Guid? ParentId { get; set; }
    public Parent? Parent { get; set; }

    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string MotherName { get; set; } = string.Empty;
    public string FatherName { get; set; } = string.Empty;
    
    // Eğitim ve İletişim
    public string SchoolName { get; set; } = string.Empty;
    public string Grade { get; set; } = string.Empty; // Sınıf
    public DateTime DateOfBirth { get; set; }
    public string PlaceOfBirth { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty; // Sporcu telefonu
    
    // Sağlık Bilgileri
    public BloodType BloodType { get; set; }
    public string EmergencyContactName { get; set; } = string.Empty;
    public string EmergencyContactPhone { get; set; } = string.Empty;
    public string EmergencyContactRelation { get; set; } = string.Empty;
    public string RegularMedications { get; set; } = string.Empty; // Kullanılan İlaçlar
    public string ChronicDiseases { get; set; } = string.Empty; // Kronik Hastalıklar

    // Fiziksel Ölçümler (İlk Kayıt Değerleri, sonradan Gelişim tablosunda da takip edilebilir)
    public double Height { get; set; } // Boy (cm)
    public double Weight { get; set; } // Kilo (kg)
    public double ShoeSize { get; set; } // Ayak numarası (palet vs)
    public string JerseySize { get; set; } = string.Empty; // Forma bedeni
    public string EquipmentSize { get; set; } = string.Empty; // Ekipman bedeni
    public double Flexibility { get; set; } // Esneklik ölçümü
    public double VerticalJump { get; set; } // Zıplama ölçümü

    // Kulüp Bilgileri
    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
    
    // Dosyalar (AWS S3 veya URL üzerinden tutulur)
    public string PhotoUrl { get; set; } = string.Empty;
    public string IdentityDocumentUrl { get; set; } = string.Empty; // Kimlik fotokopisi

    // İlişkiler
    public ICollection<SportsClub.Domain.Entities.Training.Team> Teams { get; set; } = new List<SportsClub.Domain.Entities.Training.Team>();
    public ICollection<SportsClub.Domain.Entities.Operations.Attendance> Attendances { get; set; } = new List<SportsClub.Domain.Entities.Operations.Attendance>();
    public ICollection<SportsClub.Domain.Entities.Accounting.Payment> Payments { get; set; } = new List<SportsClub.Domain.Entities.Accounting.Payment>();
    public ICollection<SportsClub.Domain.Entities.Medical.PhysicalMeasurement> PhysicalMeasurements { get; set; } = new List<SportsClub.Domain.Entities.Medical.PhysicalMeasurement>();
    public ICollection<SportsClub.Domain.Entities.Operations.ShuttleStudent> ShuttleStudents { get; set; } = new List<SportsClub.Domain.Entities.Operations.ShuttleStudent>();
}
