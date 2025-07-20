import { Admin, Prisma, UserRole, UserStatus } from "@prisma/client";
import bcrypt from 'bcrypt';
import { prisma } from "../../utility/prisma";
import { Request } from "express";
import { fileUploader } from "../../utility/fileUploader";
import { IPagination } from "../../Interfaces/pagination";
import calculatePagination from "../../utility/pagination";
import { userSearchableFields } from "./user.constant";
import { JwtPayload } from "jsonwebtoken";



const createAdmin = async (req: Request) => {

    const file = req.file;
    const payload = req.body;

    if (file) {
        const uploadFile = await fileUploader.uploadToCloudinary(file);
        
        payload.admin.profilePhoto = uploadFile?.url

    }


    const hashedPassword: string = await bcrypt.hash(payload.password, 10)

    const userData = {
        email: payload.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        const createdUserData = await transactionClient.user.create({
            data: userData
        })

        const createdAdminData = await transactionClient.admin.create({
            data: payload.admin
        })

        return {
            createdUserData,
            createdAdminData
        }

    })


    return result
}



const createDoctor = async (req: Request) => {

    const file = req.file;
    const payload = req.body;

    if (file) {
        const uploadFile = await fileUploader.uploadToCloudinary(file);

        payload.doctor.profilePhoto = uploadFile?.url

    }


    const hashedPassword: string = await bcrypt.hash(payload.password, 10)

    const userData = {
        email: payload.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        const createdUserData = await transactionClient.user.create({
            data: userData
        })

        const createdDoctorData = await transactionClient.doctor.create({
            data: payload.doctor
        })

        return {
            createdUserData,
            createdDoctorData
        }

    })


    return result
}



const createPatient = async (req: Request) => {

    const file = req.file;
    const payload = req.body;

    if (file) {
        const uploadFile = await fileUploader.uploadToCloudinary(file);

        payload.patient.profilePhoto = uploadFile?.url

    }


    const hashedPassword: string = await bcrypt.hash(payload.password, 10)

    const userData = {
        email: payload.patient.email,
        password: hashedPassword,
        role: UserRole.PATIENT
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        const createdUserData = await transactionClient.user.create({
            data: userData
        })

        const createdPatientData = await transactionClient.patient.create({
            data: payload.patient
        })

        return {
            createdUserData,
            createdPatientData
        }

    })


    return result
}


const getAllFromDB = async (query: any, options: IPagination) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

    const { searchTerm, ...filterData } = query;
    const andConditions: Prisma.UserWhereInput[] = [];

    if (query.searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map(field => ({
                [field]: {
                    contains: query.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        })
    }

    // console.dir(andConditions, { depth: Infinity });

    const whereCondition: Prisma.UserWhereInput = { AND: andConditions }

    // console.dir(whereCondition, { depth: Infinity });

    const result = await prisma.user.findMany({
        where: whereCondition,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: {
            [sortBy]: sortOrder
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            needPasswordChange: true,
            createdAt: true,
            updatedAt: true,
            admin: true,
            patient: true,
            doctor: true
        }
    })

    const total = await prisma.user.count({
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


const myProfile = async (user: JwtPayload) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email
        },
        select: {
            email: true,
            status: true,
            role: true,
            id: true,
            admin: true,
            patient: true,
            doctor: true
        }
    })

    return userData;
}


const updateMyProfile = async (user: JwtPayload, req: Request) => {
    const file = req.file;
    const payload = req.body; 


    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    })


    if (file) {
        const uploadFile = await fileUploader.uploadToCloudinary(file);
        
        payload.profilePhoto = uploadFile?.url

        
    }
    
    let result;
    if (userData.role === UserRole.PATIENT) {
        result = await prisma.patient.update({
            where: {
                email: userData.email
            },
            data: payload
        })
    }
    if (userData.role === UserRole.DOCTOR) {
        result = await prisma.doctor.update({
            where: {
                email: userData.email
            },
            data: payload
        })
    }
    if (userData.role === UserRole.ADMIN || userData.role === UserRole.SUPER_ADMIN) {
        result = await prisma.admin.update({
            where: {
                email: userData.email
            },
            data: payload
        })
    } 


    return result
}




export const userServices = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB,
    myProfile,
    updateMyProfile
}