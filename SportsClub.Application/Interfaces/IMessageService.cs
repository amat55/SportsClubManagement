using SportsClub.Application.DTOs.Communication;

namespace SportsClub.Application.Interfaces;

public interface IMessageService
{
    Task<IEnumerable<MessageDto>> GetInboxAsync(Guid userId);
    Task<IEnumerable<MessageDto>> GetSentMailsAsync(Guid userId);
    Task<MessageDto> SendMessageAsync(Guid senderId, SendMessageDto model);
    Task<bool> MarkAsReadAsync(Guid messageId, Guid userId); // Sadece alıcı okundu olarak işaretleyebilir
}
