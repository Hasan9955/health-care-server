import { addHours, addMinutes, format } from 'date-fns';
import { prisma } from '../../utility/prisma';
import { TSchedule } from './schedule.constant';


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



export const scheduleServices = {
    insertIntoDB
}