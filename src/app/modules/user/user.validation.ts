import { z } from "zod"; 


const createAdminValidationSchema = z.object({
    password: z.string({
        required_error: "Password is required"
    }),
    admin: z.object({
        name: z.string({
            required_error: "name is required"
        }),
        email: z.string({
            required_error: "email is required"
        }),
        contactNumber: z.string({
            required_error: "contact Number is required"
        }),
    })
})

const createPatientValidationSchema = z.object({
    password: z.string({
        required_error: "Password is required"
    }),
    patient: z.object({
        name: z.string({
            required_error: "name is required"
        }),
        email: z.string({
            required_error: "email is required"
        }),
        contactNumber: z.string({
            required_error: "contact Number is required"
        }),
        address: z.string().optional()
    })
})


const createDoctorValidationSchema = z.object({
    password: z.string({
        required_error: "Password is required"
    }),
    doctor: z.object({
        name: z.string({
            required_error: "name is required"
        }),
        email: z.string({
            required_error: "email is required"
        }),
        contactNumber: z.string({
            required_error: "contact number is required"
        }),
        address: z.string().optional(),
        registrationNumber: z.string({
            required_error: "registration Number is required"
        }),
        experience: z.number().optional(),
        gender: z.enum(["MALE", "FEMALE"]),
        appointmentFee: z.number({
            required_error: "appointment Fee is required"
        }),
        qualification: z.string({
            required_error: "qualification is required"
        }),
        currentWorkingPlace: z.string({
            required_error: "currentWorking Place is required"
        }),
        designation: z.string({
            required_error: "designation is required"
        }),
    })
})


export const userValidation = {
    createAdminValidationSchema,
    createDoctorValidationSchema,
    createPatientValidationSchema
}