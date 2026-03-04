namespace SportsClub.Application.Interfaces;

public interface INotificationService
{
    Task SendEmailAsync(string toEmail, string subject, string body);
    Task SendSmsAsync(string phoneNumber, string message);
}
