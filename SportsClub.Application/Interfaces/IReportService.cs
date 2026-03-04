using SportsClub.Application.DTOs.Reporting;

namespace SportsClub.Application.Interfaces;

public interface IReportService
{
    Task<DashboardSummaryDto> GetDashboardSummaryAsync();
    // Diğer rapor metodları buraya eklenebilir (Örn: En çok ödeyen takımlar vs)
}
