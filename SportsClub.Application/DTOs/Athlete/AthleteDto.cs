using SportsClub.Domain.Enums;

namespace SportsClub.Application.DTOs.Athlete;

public class AthleteDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string BloodType { get; set; } = string.Empty;
    public double Height { get; set; }
    public double Weight { get; set; }
    public string Address { get; set; } = string.Empty;
    public string EmergencyContactName { get; set; } = string.Empty;
    public string EmergencyContactPhone { get; set; } = string.Empty;
    public string EmergencyContactRelation { get; set; } = string.Empty;
    public string MotherName { get; set; } = string.Empty;
    public string FatherName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime RegistrationDate { get; set; }
}
