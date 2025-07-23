import axios from 'axios';
import AppError from '../../error/appError';
import { prisma } from '../../utility/prisma';
import { sslService, validateSslPayment } from '../../utility/ssl.service';
import Config from '../../../Config';
import { AppointmentStatus, PaymentStatus } from '@prisma/client';



const initPayment = async (appointmentId: string) => {
    const paymentData = await prisma.payment.findFirstOrThrow({
        where: {
            appointmentId
        },
        include: {
            appointment: {
                include: {
                    patient: true
                }
            }
        }
    })


    const initPaymentData = {
        amount: paymentData.amount,
        transactionId: paymentData.transactionId,
        name: paymentData.appointment.patient.name,
        email: paymentData.appointment.patient.email,
        contactNumber: paymentData.appointment.patient.contactNumber,
        address: paymentData.appointment.patient.address,
    }


    const response = await sslService(initPaymentData);

    return {
        paymentUrl: response.GatewayPageURL
    }


}


const validatePayment = async (payload: any) => {

    // TODO: UNCOMMENT THIS CODE WHEN SSL PAYMENT VALIDATION IS IMPLEMENTED!!!!!!!!
   
    // if (!payload || !payload.status || !(payload.status === "VALID")) {
    //     throw new AppError(400, "Payment validation failed");
    // }

    // const response = await validateSslPayment(payload);

    // if (response.status !== "VALID") {
    //     throw new AppError(400, "Payment validation failed");
    // }

    // TODO: REMOVE THIS CODE WHEN SSL PAYMENT VALIDATION IS IMPLEMENTED!!!!!!!!
    const response = {
        tran_id: payload.tran_id,
        amount: payload.amount,
        status: payload.status
    }

    // Update the payment status in the database
    await prisma.$transaction(async (tx) => {
        const updatedPaymentData = await tx.payment.update({
            where: {
                transactionId: response.tran_id
            },
            data: {
                status: PaymentStatus.PAID,
                paymentGatewayData: response
            }
        })

        await tx.appointment.update({
            where: {
                id: updatedPaymentData.appointmentId
            },
            data: { 
                paymentStatus: PaymentStatus.PAID
            }
        })
    })

    return {
        message: "Payment validated successfully",
        transactionId: response.tran_id,
        amount: response.amount,
        status: response.status
    }
 


}


export const paymentServices = {
    initPayment,
    validatePayment

}


