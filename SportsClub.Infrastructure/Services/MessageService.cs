using Microsoft.EntityFrameworkCore;
using SportsClub.Application.DTOs.Communication;
using SportsClub.Application.Interfaces;
using SportsClub.Domain.Entities.Communication;
using SportsClub.Infrastructure.Persistence;

namespace SportsClub.Infrastructure.Services;

public class MessageService : IMessageService
{
    private readonly ApplicationDbContext _context;

    public MessageService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MessageDto>> GetInboxAsync(Guid userId)
    {
        return await _context.Messages
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .Where(m => m.ReceiverId == userId)
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new MessageDto
            {
                Id = m.Id,
                SenderId = m.SenderId,
                SenderName = m.Sender != null ? $"{m.Sender.FirstName} {m.Sender.LastName}" : string.Empty,
                ReceiverId = m.ReceiverId,
                ReceiverName = m.Receiver != null ? $"{m.Receiver.FirstName} {m.Receiver.LastName}" : string.Empty,
                Content = m.Content,
                SentAt = m.CreatedAt,
                IsRead = m.IsRead,
                ReadAt = m.ReadAt
            }).ToListAsync();
    }

    public async Task<IEnumerable<MessageDto>> GetSentMailsAsync(Guid userId)
    {
        return await _context.Messages
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .Where(m => m.SenderId == userId)
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new MessageDto
            {
                Id = m.Id,
                SenderId = m.SenderId,
                SenderName = m.Sender != null ? $"{m.Sender.FirstName} {m.Sender.LastName}" : string.Empty,
                ReceiverId = m.ReceiverId,
                ReceiverName = m.Receiver != null ? $"{m.Receiver.FirstName} {m.Receiver.LastName}" : string.Empty,
                Content = m.Content,
                SentAt = m.CreatedAt,
                IsRead = m.IsRead,
                ReadAt = m.ReadAt
            }).ToListAsync();
    }

    public async Task<MessageDto> SendMessageAsync(Guid senderId, SendMessageDto model)
    {
        var message = new Message
        {
            SenderId = senderId,
            ReceiverId = model.ReceiverId,
            Content = model.Content,
            IsRead = false
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        return new MessageDto
        {
            Id = message.Id,
            SenderId = message.SenderId,
            ReceiverId = message.ReceiverId,
            Content = message.Content,
            SentAt = message.CreatedAt,
            IsRead = message.IsRead
        };
    }

    public async Task<bool> MarkAsReadAsync(Guid messageId, Guid userId)
    {
        var message = await _context.Messages.FirstOrDefaultAsync(m => m.Id == messageId && m.ReceiverId == userId);
        if (message == null) return false;

        message.IsRead = true;
        message.ReadAt = DateTime.UtcNow;
        message.UpdatedAt = DateTime.UtcNow;

        _context.Messages.Update(message);
        await _context.SaveChangesAsync();
        
        return true;
    }
}
