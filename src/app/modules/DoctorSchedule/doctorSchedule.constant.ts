

export const doctorScheduleFilterableFields = [
'doctorId',
'scheduleId',
'isBooked',
'appointmentId'
]
export type ResDoctorSchedule = {
    doctorId: string;
    scheduleId: string;
    isBooked: boolean;
    appointmentId: string | null;
}

export type TDoctorScheduleQuery = {
    doctorId?: string | undefined;
    scheduleId?: string | undefined;
    isBooked?: boolean | undefined;
    appointmentId?: string | undefined;
}

export type ResGetDoctorSchedule = {
    meta: {
        page: number,
        limit: number,
        total: number,
        skip: number;
    },
    data: {
        result: ResDoctorSchedule[] | null
    }
} | null;