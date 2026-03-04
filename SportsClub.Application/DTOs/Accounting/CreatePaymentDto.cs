namespace SportsClub.Application.DTOs.Accounting;

public class CreatePaymentDto
{
    public Guid AthleteId { get; set; }
    public string PaymentType { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime DueDate { get; set; }
    public string Description { get; set; } = string.Empty;
}
