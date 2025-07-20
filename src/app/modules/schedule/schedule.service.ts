import { addHours, addMinutes, format } from 'date-fns';
import { prisma } from '../../utility/prisma';
import { ResGetAllSchedule, ResSchedule, TSchedule, TScheduleQuery } from './schedule.constant';
import { IPagination } from '../../Interfaces/pagination';
import calculatePagination from '../../utility/pagination';
import { Prisma } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';



const getAllSchedules = async (
    user: JwtPayload, query: TScheduleQuery, options: IPagination): Promise<ResGetAllSchedule> => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

    const { startDateTime, endDateTime, ...filterData } = query;
    
    const addCondition: Prisma.ScheduleWhereInput[] = [];

    if (startDateTime && endDateTime) {
        addCondition.push({
            AND: [
                {
                    startDateTime: {
                        gte: startDateTime
                    }
                },
                {
                    endDateTime: {
                        lte: endDateTime
                    }
                }
            ]
        })
    }

    if (Object.keys(filterData).length > 0) {
        addCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }


    const whereCondition: Prisma.ScheduleWhereInput = { AND: addCondition }

    const doctorSchedules = await prisma.doctorSchedules.findMany({
        where: {
            doctor: {
                email: user.email
            }
        }
    })

    const doctorSchedulesIds = doctorSchedules.map(schedule => schedule.scheduleId) 

    const result = await prisma.schedule.findMany({
        where: {
            ...whereCondition,
            id: {
                notIn: doctorSchedulesIds
            }
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { startDateTime: 'asc'}
    }) 

    const total = await prisma.schedule.count({
        where: {
            ...whereCondition,
            id: {
                notIn: doctorSchedulesIds
            }
        }
    })

    return {
        meta: {
            page,
            limit,
            total,
            skip
        },
        data: {
            result
        }
    };

}

const insertIntoDB = async (payload: TSchedule) => {

    const {
        startDate,
        endDate,
        startTime,
        endTime
    } = payload

    const schedules = []
    const intervalTime = 30;
    const beginDate = new Date(startDate)
    const lastDate = new Date(endDate)

    while (beginDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(beginDate, 'yyyy-MM-dd')}`,
                    Number(startTime.split(':')[0])
                ),
                Number(startTime.split(':')[1])
            )
        )

        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(beginDate, 'yyyy-MM-dd')}`,
                    Number(endTime.split(':')[0])
                ),
                Number(endTime.split(':')[1])
            )
        )

        while (startDateTime < endDateTime) {
            const scheduleData = {
                startDateTime,
                endDateTime: addMinutes(startDateTime, intervalTime)
            }

            const isExists = await prisma.schedule.findFirst({
                where: {
                    startDateTime: scheduleData.startDateTime,
                    endDateTime: scheduleData.endDateTime
                }
            })

            if (!isExists) {
                const result = await prisma.schedule.create({
                    data: scheduleData
                })
                schedules.push(result)
            }

            startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime)
        }

        beginDate.setDate(beginDate.getDate() + 1)
    }


    return schedules;
}


const getASchedule = async (id: string) => {
    const schedule = await prisma.schedule.findUnique({
        where: {
            id
        }
    })

    if (!schedule) {
        throw new Error('Schedule not found')
    }

    return schedule;
}





export const scheduleServices = {
    insertIntoDB,
    getAllSchedules,
    getASchedule
}