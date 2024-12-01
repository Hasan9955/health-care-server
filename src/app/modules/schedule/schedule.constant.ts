

export type TSchedule = {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
}

export type ResSchedule = {
            id: string;
            startDateTime: Date;
            endDateTime: Date;
            createdAt: Date;
            updatedAt: Date;
}


export type TScheduleQuery = {
    startDateTime?: string | undefined;
    endDateTime?: string | undefined;
}

export type ResGetAllSchedule = {
    meta: {
        page: number,
        limit: number,
        total: number,
        skip: number; 
    },
    data: {
        result: ResSchedule[] | null
    }
} | null;