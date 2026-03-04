export interface Shuttle {
    id: string;
    licensePlate: string;
    driverName: string;
    driverPhone: string;
    routeName: string;
    capacity: number;
    enrolledStudentCount: number;
}

export interface CreateShuttleDto {
    licensePlate: string;
    driverName: string;
    driverPhone: string;
    routeName: string;
    capacity: number;
}

export interface EnrollStudentDto {
    athleteId: string;
    pickUpDropOffPoint: string;
}
