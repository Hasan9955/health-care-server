import { BloodGroup, Gender, MaritalStatus } from "@prisma/client";

export const patientFilterableFields = ['name', 'email', 'searchTerm', 'contactNumber'];

export const patientSearchableFields = ['name', 'email', 'contactNumber'];


export type TPatient = {
    id: string;
    name: string;
    email: string;
    profilePhoto: string | null;
    contactNumber: string;
    address: string | null;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export type TPatientUpdate = {
    id: string;
    name: string;
    email: string;
    profilePhoto: string;
    contactNumber: string;
    address: string;
    patientHealthData: {
        id: string;
        patientId: string;
        dateOfBirth: string;
        gender: Gender;
        bloodGroup: BloodGroup;
        hasAllergies: boolean;
        hasDiabetes: boolean;
        height: string;
        weight: string;
        smokingStatus: boolean;
        dietaryPreferences: string;
        pregnancyStatus: boolean;
        mentalHealthHistory: string;
        immunizationStatus: string;
        hasPastSurgeries: boolean;
        recentAnxiety: boolean;
        recentDepression: boolean;
        maritalStatus: MaritalStatus;
    };
    medicalReport: {
        id: string;
        patientId: string;
        reportName: string;
        reportLink: string;
    };
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}