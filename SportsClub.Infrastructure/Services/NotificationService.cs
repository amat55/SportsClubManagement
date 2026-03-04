using Microsoft.Extensions.Logging;
using SportsClub.Application.Interfaces;

namespace SportsClub.Infrastructure.Services;

public class NotificationService : INotificationService
{
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(ILogger<NotificationService> logger)
    {
        _logger = logger;
    }

    public Task SendEmailAsync(string toEmail, string subject, string body)
    {
        // TODO: Gerçek SMTP, SendGrid veya AWS SES entegrasyonu buraya yapılacak
        _logger.LogInformation("Email sent to {Email}. Subject: {Subject}. Body: {Body}", toEmail, subject, body);
        return Task.CompletedTask;
    }

    public Task SendSmsAsync(string phoneNumber, string message)
    {
        // TODO: Gerçek SMS API (NetGsm, Twilio, İletiMerkezi vs.) entegrasyonu buraya yapılacak
        _logger.LogInformation("SMS sent to {Phone}. Message: {Message}", phoneNumber, message);
        return Task.CompletedTask;
    }
}
