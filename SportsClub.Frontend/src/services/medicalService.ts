import api from './api';
import type { PhysicalMeasurement, CreatePhysicalMeasurementDto } from '../types/medical';

export const medicalService = {
    getMeasurementsByAthlete: async (athleteId: string): Promise<PhysicalMeasurement[]> => {
        const response = await api.get(`/medical/athlete/${athleteId}/measurements`);
        return response.data;
    },

    addMeasurement: async (data: CreatePhysicalMeasurementDto): Promise<PhysicalMeasurement> => {
        const response = await api.post('/medical/measurements', data);
        return response.data;
    },

    deleteMeasurement: async (id: string): Promise<void> => {
        await api.delete(`/medical/measurements/${id}`);
    }
};
