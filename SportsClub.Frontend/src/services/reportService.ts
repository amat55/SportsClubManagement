import api from './api';

export interface DashboardSummary {
    totalAthletes: number;
    activeTeams: number;
    totalRevenue: number;
    pendingPayments: number;
}

export const reportService = {
    getDashboardSummary: async (): Promise<DashboardSummary> => {
        const response = await api.get('/reports/dashboard');
        return response.data;
    }
};
