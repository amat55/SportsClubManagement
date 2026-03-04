using Microsoft.EntityFrameworkCore;
using SportsClub.Application.DTOs.Reporting;
using SportsClub.Application.Interfaces;
using SportsClub.Infrastructure.Persistence;

namespace SportsClub.Infrastructure.Services;

public class ReportService : IReportService
{
    private readonly ApplicationDbContext _context;

    public ReportService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
    {
        var totalAthletes = await _context.Athletes.CountAsync(a => a.IsActive);
        var activeTeams = await _context.Teams.CountAsync(t => t.IsActive);
        
        // Sadece ödenmiş olanların toplamı (Gelir)
        var totalRevenue = await _context.Payments
            .Where(p => p.IsPaid)
            .SumAsync(p => p.Amount);
            
        // Ödenmemiş olanların toplamı (Bekleyen, Alacak)
        var pendingPayments = await _context.Payments
            .Where(p => !p.IsPaid)
            .SumAsync(p => p.Amount);

        return new DashboardSummaryDto
        {
            TotalAthletes = totalAthletes,
            ActiveTeams = activeTeams,
            TotalRevenue = totalRevenue,
            PendingPayments = pendingPayments
        };
    }
}
