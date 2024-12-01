import { Prisma } from "@prisma/client";
import { prisma } from "../../utility/prisma";
import { JwtPayload } from "jsonwebtoken";
import { IPagination } from "../../Interfaces/pagination";
import calculatePagination from "../../utility/pagination";
import { ResGetDoctorSchedule } from "./doctorSchedule.constant";
import AppError from "../../error/appError";





const getDoctorSchedules = async (
    user: JwtPayload, query: any, options: IPagination
): Promise<ResGetDoctorSchedule> => {
    const { page, limit, sortBy, sortOrder } = calculatePagination(options);
    const { startDateTime, endDateTime, ...filterData } = query;

    const andCondition: Prisma.DoctorSchedulesWhereInput[] = [];

    if (startDateTime && endDateTime) {
        andCondition.push({
            schedule: {
                startDateTime: { gte: startDateTime },
                endDateTime: { lte: endDateTime }
            }
        });
    }

    if (Object.keys(filterData).length > 0) {

        if(typeof filterData.isBooked === 'string' && filterData.isBooked === 'true'){
            filterData.isBooked = true
        }
        else if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'false'){
            filterData.isBooked = false
        }else {
            filterData.isBooked = undefined
        }

        andCondition.push(...Object.keys(filterData).map(key => ({
            [key]: { equals: filterData[key] }
        })));
    }
    
    const whereCondition: Prisma.DoctorSchedulesWhereInput = andCondition.length > 0 ? { AND: andCondition } : {};

    const orderBy = sortBy && sortOrder ? { [sortBy]: sortOrder } : {};
    
    const result = await prisma.doctorSchedules.findMany({
        where: {
            ...whereCondition,
            doctor: {
                email: user.email
            }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy
    });

    const total = await prisma.doctorSchedules.count({ where: {
        ...whereCondition,
        doctor: {
            email: user.email
        }
    }});

    return {
        meta: {
            page,
            limit,
            total,
            skip: (page - 1) * limit
        },
        data: {
            result
        }
    };
};





const createDoctorSchedule = async (user: any, payload: {
    scheduleIds: string[]
}) => {
    
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })

    const doctorScheduleData = payload.scheduleIds.map(scheduleId => ({
        doctorId: doctorData.id,
        scheduleId
    }))


    const result = await prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    })

    return result;
}



const deleteFromDB = async (user: JwtPayload, scheduleId: string) => {

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })

    const isScheduleBooked = await prisma.doctorSchedules.findFirst({
        where: { 
                doctorId: doctorData.id,
                scheduleId,
                isBooked: true
        }
    })

    if(isScheduleBooked){
        throw new AppError(400, 'You can not delete a booked schedule!')
    }

    const result = await prisma.doctorSchedules.delete({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId
            }
        }
    })

    return result;

}


export const doctorScheduleServices = {
    createDoctorSchedule,
    getDoctorSchedules,
    deleteFromDB
}