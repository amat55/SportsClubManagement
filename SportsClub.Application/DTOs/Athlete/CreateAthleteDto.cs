using SportsClub.Domain.Enums;

namespace SportsClub.Application.DTOs.Athlete;

public class CreateAthleteDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string MotherName { get; set; } = string.Empty;
    public string FatherName { get; set; } = string.Empty;
    public string SchoolName { get; set; } = string.Empty;
    public string Grade { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string PlaceOfBirth { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public BloodType BloodType { get; set; }
    
    // Sağlık / Fiziksel Veriler
    public string RegularMedications { get; set; } = string.Empty;
    public string ChronicDiseases { get; set; } = string.Empty;
    public double Height { get; set; }
    public double Weight { get; set; }
    public double ShoeSize { get; set; }
    
    public string EmergencyContactName { get; set; } = string.Empty;
    public string EmergencyContactPhone { get; set; } = string.Empty;
    public string EmergencyContactRelation { get; set; } = string.Empty;
}
