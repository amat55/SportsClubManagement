namespace SportsClub.Domain.Entities.Accounting;

public class Payment : BaseEntity
{
    public Guid AthleteId { get; set; }
    public Athlete? Athlete { get; set; }

    // Ödeme Türü (Aydat, Malzeme, Etkinlik Katılımı vb.)
    public string PaymentType { get; set; } = string.Empty; 
    
    // Tutar
    public decimal Amount { get; set; }

    // Beklenen Ödeme Tarihi (Vade)
    public DateTime DueDate { get; set; }

    // Gerçekleşen Ödeme Tarihi (Ödendiğinde dolar)
    public DateTime? PaymentDate { get; set; }

    public bool IsPaid { get; set; } = false;

    public string Description { get; set; } = string.Empty;
}
