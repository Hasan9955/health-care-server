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


export const userValidation = {
    createAdminValidationSchema
}