import { PrismaClient } from "@prisma/client";
import { Router } from "express";


const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    const result = await prisma.admin.findMany({})
    res.status(200).json({
        success: true,
        message: "All admins retrieved successfully",
        status: 200,
        data: result
    })
} )


export const adminRoutes = router