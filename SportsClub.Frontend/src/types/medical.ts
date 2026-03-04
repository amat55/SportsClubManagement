export interface PhysicalMeasurement {
    id: string;
    athleteId: string;
    measurementDate: string;
    height: number;
    weight: number;
    armSpan: number | null;
    bodyFatPercentage: number | null;
    flexibilityScore: number | null;
    jumpHeight: number | null;
    notes: string;
}

export interface CreatePhysicalMeasurementDto {
    athleteId: string;
    measurementDate: string;
    height: number;
    weight: number;
    armSpan?: number;
    bodyFatPercentage?: number;
    flexibilityScore?: number;
    jumpHeight?: number;
    notes?: string;
}
