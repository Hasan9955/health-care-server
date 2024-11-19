import { Admin, Prisma, UserStatus } from "@prisma/client"
import { adminSearchableFields } from "./admin.constant";
import calculatePagination from "../../utility/pagination";
import { prisma } from "../../utility/prisma";
import { IPagination } from "../../Interfaces/pagination";



export type TQuery = {
    searchTerm: string;
    [key: string]: string;
}


const getAllFromDB = async (query: TQuery, options: IPagination) => {
    const {page, limit, skip, sortBy, sortOrder} = calculatePagination(options);
    
    const { searchTerm, ...filterData } = query;
    const addCondition: Prisma.AdminWhereInput[] = [];

    if (query.searchTerm) {
        addCondition.push({
            OR: adminSearchableFields.map(field => ({
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

    const whereCondition: Prisma.AdminWhereInput = { AND: addCondition }

    const result = await prisma.admin.findMany({
        where: whereCondition,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: {
            [sortBy]: sortOrder
        } 
    })

    const total = await prisma.admin.count({
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


const getSingleAdmin = async (id: string): Promise<Admin | null> => {
    const result = await prisma.admin.findUnique({
        where: {
            id,
            isDeleted: false
        }
    })
    return result;
}


const updateAdmin = async (id: string, payload: Partial<Admin>): Promise<Admin | null> => {

    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    })

    const result = await prisma.admin.update({
        where: {
            id,
            isDeleted: false
        },
        data: payload
    })
    return result;

}

const softDeleteAdmin = async (id: string): Promise<Admin | null> => {

    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    })

    const result = await prisma.$transaction(async (transactionClient) => {

        const adminDeletedData = await transactionClient.admin.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        })

         await transactionClient.user.update({
            where: {
                email: adminDeletedData.email
            },
            data: {
                status: UserStatus.BLOCKED
            }
        })

        return adminDeletedData
    })


    return result;

}


const deleteAdmin = async (id: string) => {

    await prisma.admin.findUniqueOrThrow({
        where: {
            id
        }
    })

    const result = await prisma.$transaction(async (transactionClient) => {

        const deletedAdminData = await transactionClient.admin.delete({
            where: {
                id
            }
        })

       await transactionClient.user.delete({
            where: {
                email: deletedAdminData.email
            }
        })

        return deletedAdminData

    })
}


export const AdminServices = {
    getAllFromDB,
    getSingleAdmin,
    updateAdmin,
    deleteAdmin,
    softDeleteAdmin
}