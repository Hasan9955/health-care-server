import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../utility/prisma";
import { v4 as uuidv4 } from 'uuid';
import { IPagination } from "../../Interfaces/pagination";
import calculatePagination from "../../utility/pagination";
import { AppointmentStatus, Prisma, UserRole } from "@prisma/client";
import AppError from "../../error/appError";


const createAppointment = async (user: JwtPayload, payload: any) => {


    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId
        }
    })


    const doctorScheduleData = await prisma.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: doctorData.id,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    })


    const videoCallingId = uuidv4();

    const result = await prisma.$transaction(async (tx) => {
        const appointmentData = await tx.appointment.create({
            data: {
                doctorId: doctorData.id,
                patientId: patientData.id,
                scheduleId: payload.scheduleId,
                videoCallingId
            },
            include: {
                doctor: true,
                patient: true,
                schedule: true,
            }
        })

        await tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorData.id,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true,
                appointmentId: appointmentData.id
            }
        })

        // PD-HealthCare-datetime
        const today = new Date();
        const id1 = uuidv4().replace(/-/g, "").slice(6, 18);
        const id2 = uuidv4().replace(/-/g, "").slice(4, 16);
        const transactionId = id1 + id2;
 

        await tx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId
            }
        })

        return appointmentData
    })

    return result;
}


const getAllAppointments = async (user: JwtPayload, filter: any, options: IPagination) => {

    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

    const { ...filterData } = filter;

    const addCondition: Prisma.AppointmentWhereInput[] = [];


    if (Object.keys(filterData).length > 0) {
        addCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        })
    }



    const whereCondition: Prisma.AppointmentWhereInput = { AND: addCondition }

    const result = await prisma.appointment.findMany({
        where: whereCondition,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            patient: {
                include: {
                    medicalReport: true,
                    patientHealthData: true
                }
            },
            doctor: true, 
            schedule: true, 
        }
        
    })

    const total = await prisma.appointment.count({
        where: whereCondition
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




const myAppointments = async (user: JwtPayload, filter: any, options: IPagination) => {

    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

    const { ...filterData } = filter;

    const addCondition: Prisma.AppointmentWhereInput[] = [];

    if (user?.role === UserRole.PATIENT) {
        addCondition.push({
            patient: {
                email: user?.email
            }
        })
    } else if (user?.role === UserRole.DOCTOR) {
        addCondition.push({
            doctor: {
                email: user?.email
            }
        })
    }

    if (Object.keys(filterData).length > 0) {
        addCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        })
    }



    const whereCondition: Prisma.AppointmentWhereInput = { AND: addCondition }

    const result = await prisma.appointment.findMany({
        where: whereCondition,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: {
            [sortBy]: sortOrder
        },
        include: user.role === UserRole.PATIENT ? {
            doctor: true, 
            schedule: true,
        } : { 
            patient: {
                include: {
                medicalReport   : true,
                patientHealthData: true
            },
        },
            schedule: true,
        }
    })

    const total = await prisma.appointment.count({
        where: whereCondition
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


const changeAppointmentStatus = async (appointmentId: string, status: AppointmentStatus, user: JwtPayload) => {

    const isUserExists = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: appointmentId
        }
    })

    if(user.role === UserRole.DOCTOR){
        if (isUserExists.doctorId !== user.id) {
            throw new AppError(400, "You are not authorized to change the status of this appointment");
        }
    }
    

    const result = await prisma.appointment.update({
        where: {
            id: appointmentId
        },
        data: {
            status
        }
    })

    return result;


}

const cancelUnpaidAppointments = async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 1 * 60 * 1000);


    const unpaidAppointments = await prisma.appointment.findMany({
        where: {
            paymentStatus: 'UNPAID',
            createdAt: {
                lt: thirtyMinutesAgo
            }
        }
    });

    const arrayOfUnpaidAppointmentIds = unpaidAppointments.map(appointment => appointment.id);

    await prisma.$transaction(async (tx) => {

        await tx.payment.deleteMany({
            where: {
                appointmentId: {
                    in: arrayOfUnpaidAppointmentIds
                }
            }
        })

        await tx.appointment.deleteMany({
            where: {
                id: {
                    in: arrayOfUnpaidAppointmentIds
                }
            }
        }) 

        for(const unpaidAppoint of unpaidAppointments){
            await tx.doctorSchedules.updateMany({
            where: {
                doctorId: unpaidAppoint.doctorId,
                scheduleId: unpaidAppoint.scheduleId
            },
            data: {
                isBooked: false
            }
        })
        }
    })

    return arrayOfUnpaidAppointmentIds

}



export const appointmentService = {
    createAppointment,
    myAppointments,
    getAllAppointments,
    changeAppointmentStatus,
    cancelUnpaidAppointments
}