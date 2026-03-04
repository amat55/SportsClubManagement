import api from './api';
import type { AttendanceFile, TakeAttendanceDto } from '../types/attendance';

export const attendanceService = {
    getBySession: async (sessionId: string): Promise<AttendanceFile[]> => {
        const response = await api.get(`/attendances/session/${sessionId}`);
        return response.data;
    },

    getByAthlete: async (athleteId: string): Promise<AttendanceFile[]> => {
        const response = await api.get(`/attendances/athlete/${athleteId}`);
        return response.data;
    },

    takeOrUpdate: async (data: TakeAttendanceDto): Promise<string> => {
        const response = await api.post('/attendances', data);
        return response.data;
    }
};
