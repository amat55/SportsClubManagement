export interface AttendanceFile {
    id: string;
    trainingSessionId: string;
    trainingSessionTitle: string;
    athleteId: string;
    athleteFullName: string;
    isPresent: boolean;
    excuseNote: string;
}

export interface TakeAttendanceDto {
    trainingSessionId: string;
    athleteId: string;
    isPresent: boolean;
    excuseNote: string;
}
