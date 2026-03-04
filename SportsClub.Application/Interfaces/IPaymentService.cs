using SportsClub.Application.DTOs.Accounting;

namespace SportsClub.Application.Interfaces;

public interface IPaymentService
{
    Task<IEnumerable<PaymentDto>> GetAllPaymentsAsync();
    Task<IEnumerable<PaymentDto>> GetPaymentsByAthleteAsync(Guid athleteId);
    Task<IEnumerable<PaymentDto>> GetUnpaidPaymentsAsync();
    
    Task<PaymentDto> CreatePaymentAsync(CreatePaymentDto model);
    Task<bool> MarkAsPaidAsync(Guid paymentId);
    Task<bool> DeletePaymentAsync(Guid paymentId);
}
