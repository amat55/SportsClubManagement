namespace SportsClub.Domain.Entities.Communication;

public class Message : BaseEntity
{
    public Guid SenderId { get; set; }
    public AppUser? Sender { get; set; }

    public Guid ReceiverId { get; set; }
    public AppUser? Receiver { get; set; }

    public string Content { get; set; } = string.Empty;
    
    public bool IsRead { get; set; } = false;
    public DateTime? ReadAt { get; set; }
}
