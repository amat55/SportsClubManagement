namespace SportsClub.Application.DTOs.Reporting;

public class DashboardSummaryDto
{
    public int TotalAthletes { get; set; }
    public int ActiveTeams { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal PendingPayments { get; set; }
}
