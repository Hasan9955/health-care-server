"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const createAdminValidationSchema = zod_1.z.object({
    password: zod_1.z.string({
        required_error: "Password is required"
    }),
    admin: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "name is required"
        }),
        email: zod_1.z.string({
            required_error: "email is required"
        }),
        contactNumber: zod_1.z.string({
            required_error: "contact Number is required"
        }),
    })
});
const createPatientValidationSchema = zod_1.z.object({
    password: zod_1.z.string({
        required_error: "Password is required"
    }),
    patient: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "name is required"
        }),
        email: zod_1.z.string({
            required_error: "email is required"
        }),
        contactNumber: zod_1.z.string({
            required_error: "contact Number is required"
        }),
        address: zod_1.z.string().optional()
    })
});
const createDoctorValidationSchema = zod_1.z.object({
    password: zod_1.z.string({
        required_error: "Password is required"
    }),
    doctor: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "name is required"
        }),
        email: zod_1.z.string({
            required_error: "email is required"
        }),
        contactNumber: zod_1.z.string({
            required_error: "contact number is required"
        }),
        address: zod_1.z.string().optional(),
        registrationNumber: zod_1.z.string({
            required_error: "registration Number is required"
        }),
        experience: zod_1.z.number().optional(),
        gender: zod_1.z.enum(["MALE", "FEMALE"]),
        appointmentFee: zod_1.z.number({
            required_error: "appointment Fee is required"
        }),
        qualification: zod_1.z.string({
            required_error: "qualification is required"
        }),
        currentWorkingPlace: zod_1.z.string({
            required_error: "currentWorking Place is required"
        }),
        designation: zod_1.z.string({
            required_error: "designation is required"
        }),
    })
});
exports.userValidation = {
    createAdminValidationSchema,
    createDoctorValidationSchema,
    createPatientValidationSchema
};
