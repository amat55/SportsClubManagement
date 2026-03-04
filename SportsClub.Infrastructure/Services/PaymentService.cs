using Microsoft.EntityFrameworkCore;
using SportsClub.Application.DTOs.Accounting;
using SportsClub.Application.Interfaces;
using SportsClub.Domain.Entities.Accounting;
using SportsClub.Infrastructure.Persistence;

namespace SportsClub.Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _context;

    public PaymentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PaymentDto>> GetAllPaymentsAsync()
    {
        return await _context.Payments
            .Include(p => p.Athlete)
            .AsNoTracking()
            .Select(p => new PaymentDto
            {
                Id = p.Id,
                AthleteId = p.AthleteId,
                AthleteFullName = p.Athlete != null ? $"{p.Athlete.FirstName} {p.Athlete.LastName}" : string.Empty,
                PaymentType = p.PaymentType,
                Amount = p.Amount,
                DueDate = p.DueDate,
                PaymentDate = p.PaymentDate,
                IsPaid = p.IsPaid,
                Description = p.Description
            }).ToListAsync();
    }

    public async Task<IEnumerable<PaymentDto>> GetPaymentsByAthleteAsync(Guid athleteId)
    {
        return await _context.Payments
            .Where(p => p.AthleteId == athleteId)
            .Include(p => p.Athlete)
            .AsNoTracking()
            .Select(p => new PaymentDto
            {
                Id = p.Id,
                AthleteId = p.AthleteId,
                AthleteFullName = p.Athlete != null ? $"{p.Athlete.FirstName} {p.Athlete.LastName}" : string.Empty,
                PaymentType = p.PaymentType,
                Amount = p.Amount,
                DueDate = p.DueDate,
                PaymentDate = p.PaymentDate,
                IsPaid = p.IsPaid,
                Description = p.Description
            }).ToListAsync();
    }

    public async Task<IEnumerable<PaymentDto>> GetUnpaidPaymentsAsync()
    {
        return await _context.Payments
            .Where(p => !p.IsPaid)
            .Include(p => p.Athlete)
            .AsNoTracking()
            .Select(p => new PaymentDto
            {
                Id = p.Id,
                AthleteId = p.AthleteId,
                AthleteFullName = p.Athlete != null ? $"{p.Athlete.FirstName} {p.Athlete.LastName}" : string.Empty,
                PaymentType = p.PaymentType,
                Amount = p.Amount,
                DueDate = p.DueDate,
                PaymentDate = p.PaymentDate,
                IsPaid = p.IsPaid,
                Description = p.Description
            }).ToListAsync();
    }

    public async Task<PaymentDto> CreatePaymentAsync(CreatePaymentDto model)
    {
        var payment = new Payment
        {
            AthleteId = model.AthleteId,
            PaymentType = model.PaymentType,
            Amount = model.Amount,
            DueDate = model.DueDate.ToUniversalTime(), // Proje veritabanında tarihleri UTC tutmak sağlıklıdır
            Description = model.Description,
            IsPaid = false // Yeni oluşturulan borç varsayılan olarak ödenmemiş kabul edilir
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        return new PaymentDto
        {
            Id = payment.Id,
            AthleteId = payment.AthleteId,
            PaymentType = payment.PaymentType,
            Amount = payment.Amount,
            DueDate = payment.DueDate,
            IsPaid = payment.IsPaid,
            Description = payment.Description
        };
    }

    public async Task<bool> MarkAsPaidAsync(Guid paymentId)
    {
        var payment = await _context.Payments.FindAsync(paymentId);
        if (payment == null) return false;

        payment.IsPaid = true;
        payment.PaymentDate = DateTime.UtcNow; // Ödeme tarihi şu an olarak atandı
        payment.UpdatedAt = DateTime.UtcNow;

        _context.Payments.Update(payment);
        await _context.SaveChangesAsync();
        
        return true;
    }

    public async Task<bool> DeletePaymentAsync(Guid paymentId)
    {
        var payment = await _context.Payments.FindAsync(paymentId);
        if (payment == null) return false;

        _context.Payments.Remove(payment);
        await _context.SaveChangesAsync();
        
        return true;
    }
}
