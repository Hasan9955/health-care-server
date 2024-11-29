import { Prisma, UserStatus } from "@prisma/client";
import { IPagination } from "../../Interfaces/pagination";
import calculatePagination from "../../utility/pagination";
import { TQuery } from "../admin/admin.service";
import { patientSearchableFields, TPatient, TPatientUpdate } from "./patient.constant";
import { prisma } from "../../utility/prisma";



const getAllFromDB = async (query: TQuery, options: IPagination): Promise<{
    meta: {
        page: number,
        limit: number,
        total: number,
        skip: number;
    },
    data: {
        result: TPatient[] | null
    }
} | null> => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

    const { searchTerm, ...filterData } = query;
    const addCondition: Prisma.PatientWhereInput[] = [];

    if (query.searchTerm) {
        addCondition.push({
            OR: patientSearchableFields.map(field => ({
                [field]: {
                    contains: query.searchTerm,
                    mode: 'insensitive'
                }
            }))
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

    addCondition.push({
        isDeleted: false
    })

    const whereCondition: Prisma.PatientWhereInput = { AND: addCondition }

    const result = await prisma.patient.findMany({
        where: whereCondition,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: {
            [sortBy]: sortOrder
        }
    })

    const total = await prisma.patient.count({
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


const getSinglePatient = async (id: string): Promise<TPatient | null> => {
    const result = await prisma.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    })
    return result;
}



const softDeletePatient = async (id: string) => {

    await prisma.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    })

    const result = await prisma.$transaction(async (transactionClient): Promise<TPatient | null> => {

        const PatientDeletedData = await transactionClient.patient.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        })

        await transactionClient.user.update({
            where: {
                email: PatientDeletedData.email
            },
            data: {
                status: UserStatus.DELETED
            }
        })

        return PatientDeletedData
    })


    return result;

}


const deletePatient = async (id: string): Promise<TPatient | null> => {

    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            id
        }
    })

    const result = await prisma.$transaction(async (transactionClient) => {

        await transactionClient.medicalReport.deleteMany({
            where: {
                patientId: patientData.id
            }
        })

        await transactionClient.patientHealthData.delete({
            where: {
                patientId: patientData.id
            }
        })

        const deletedPatientData = await transactionClient.patient.delete({
            where: {
                id: patientData.id
            }
        })

        await transactionClient.user.delete({
            where: {
                email: patientData.email
            }
        })

        return deletedPatientData

    })

    return result;
}


const updatePatient = async (id: string, payload: Partial<TPatientUpdate>) => {

    const { patientHealthData, medicalReport, ...patientInfo } = payload;

    const userData = await prisma.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    })


    await prisma.$transaction(async (transactionClient) => {
        const updatedPatientData = await transactionClient.patient.update({
            where: {
                id,
                isDeleted: false
            },
            data: patientInfo
        })



        // create or update patient health data
        if (patientHealthData) {
            await transactionClient.patientHealthData.upsert({
                where: {
                    patientId: userData.id
                },
                update: { ...patientHealthData },
                create: { ...patientHealthData, patientId: userData.id }
            })
        }


        // Create medical report if not duplicate
        if (medicalReport) {
            const existingReport = await transactionClient.medicalReport.findFirst({
                where: {
                    patientId: userData.id,
                    reportName: medicalReport.reportName,
                    reportLink: medicalReport.reportLink
                }
            });

            if (!existingReport) {
                // create medical report
                await transactionClient.medicalReport.create({
                    data: { ...medicalReport, patientId: userData.id }
                });
            }
        }



        return {
            updatedPatientData
        }
    })



    const result = await prisma.patient.findUniqueOrThrow({
        where: {
            id: userData.id
        },
        include: {
            patientHealthData: true,
            medicalReport: true
        }
    })


    return result;

}


export const PatientServices = {
    getAllFromDB,
    getSinglePatient,
    updatePatient,
    deletePatient,
    softDeletePatient
}