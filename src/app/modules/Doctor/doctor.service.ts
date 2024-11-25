import { prisma } from "../../utility/prisma"
import { Request } from "express";
import { fileUploader } from "../../utility/fileUploader";
import { TQuery } from "../admin/admin.service";
import { IPagination } from "../../Interfaces/pagination";
import calculatePagination from "../../utility/pagination";
import { Prisma } from "@prisma/client";
import { doctorSearchableFields } from "./doctor.constant";



const getAllDoctors = async (query: TQuery, options: IPagination) => {
    const {page, limit, skip, sortBy, sortOrder} = calculatePagination(options);
    
    const { searchTerm, specialties, ...filterData } = query; 

    const addCondition: Prisma.DoctorWhereInput[] = [];

    if (query.searchTerm) {
        addCondition.push({
            OR: doctorSearchableFields.map(field => ({
                [field]: {
                    contains: query.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if(specialties && specialties.length > 0){ 
        addCondition.push({
            doctorSpecialties: {
                some: {
                    specialties: {
                        title: {
                            contains: specialties,
                            mode: 'insensitive'
                        }
                    }
                }
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

    addCondition.push({ 
            isDeleted: false 
    })

    const whereCondition: Prisma.DoctorWhereInput = { AND: addCondition }

    const result = await prisma.doctor.findMany({
        where: whereCondition,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
    })

    const total = await prisma.doctor.count({
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


const getSingleDoctor = async (id: string) => {
    const result = await prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
    });

    return result;
}

const softDeleteDoctor = async (id: string) => {
    await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });

    const result = await prisma.doctor.update({
        where: {
            id
        },
        data: {
            isDeleted: true
        }
    })
    return result;
}

const deleteDoctor = async (id: string) => {
    await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });

    const result = await prisma.doctor.delete({
        where: {
            id
        }
    })
    return result;
}

type TSpecialty = {
    specialtiesId: string;
    isDeleted: boolean;
}
const updateDoctor = async (req: Request) => {
    const id = req.params.id
    const { specialties, ...payload } = req.body
    const file = req.file

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        },
        include: {
            doctorSpecialties: true
        }
    })

    if (file) {
        const uploadFile = await fileUploader.uploadToCloudinary(file);
        payload.profilePhoto = uploadFile?.url
    }



    await prisma.$transaction(async (transactionClient) => {
        await transactionClient.doctor.update({
            where: {
                id
            },
            data: payload,
            include: {
                doctorSpecialties: true
            }
        })

        if (specialties && specialties.length > 0) {

            //Delete specialties 
            const deleteSpecialtiesArray = specialties.filter((specialty: TSpecialty) => specialty.isDeleted) 
            for (const specialty of deleteSpecialtiesArray) { 
                await transactionClient.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: doctorData.id,
                        specialtiesId: specialty.specialtiesId
                    }
                })
            }

            //Create Specialties
            const createSpecialtiesArray = specialties.filter((specialty: any) => { 
                return !specialty.isDeleted && !doctorData.doctorSpecialties.map(special => special.specialtiesId).includes(specialty.specialtiesId)
            })  
            
            for (const specialty of createSpecialtiesArray) { 
                await transactionClient.doctorSpecialties.create({
                    data: {
                        doctorId: doctorData.id,
                        specialtiesId: specialty.specialtiesId
                    }
                })
            }

        } 
    })


    const result = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: doctorData.id
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
    })

    return result;
}


export const doctorServices = {
    getAllDoctors,
    getSingleDoctor,
    updateDoctor,
    softDeleteDoctor,
    deleteDoctor
}