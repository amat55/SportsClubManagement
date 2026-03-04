namespace SportsClub.Application.DTOs.Accounting;

public class PaymentDto
{
    public Guid Id { get; set; }
    public Guid AthleteId { get; set; }
    public string AthleteFullName { get; set; } = string.Empty;
    public string PaymentType { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? PaymentDate { get; set; }
    public bool IsPaid { get; set; }
    public string Description { get; set; } = string.Empty;
}
