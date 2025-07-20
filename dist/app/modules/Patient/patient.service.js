"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientServices = void 0;
const client_1 = require("@prisma/client");
const pagination_1 = __importDefault(require("../../utility/pagination"));
const patient_constant_1 = require("./patient.constant");
const prisma_1 = require("../../utility/prisma");
const getAllFromDB = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const { searchTerm } = query, filterData = __rest(query, ["searchTerm"]);
    const addCondition = [];
    if (query.searchTerm) {
        addCondition.push({
            OR: patient_constant_1.patientSearchableFields.map(field => ({
                [field]: {
                    contains: query.searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    if (Object.keys(filterData).length > 0) {
        addCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    addCondition.push({
        isDeleted: false
    });
    const whereCondition = { AND: addCondition };
    const result = yield prisma_1.prisma.patient.findMany({
        where: whereCondition,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: {
            [sortBy]: sortOrder
        }
    });
    const total = yield prisma_1.prisma.patient.count({
        where: whereCondition
    });
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
});
const getSinglePatient = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    return result;
});
const softDeletePatient = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    const result = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const PatientDeletedData = yield transactionClient.patient.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        });
        yield transactionClient.user.update({
            where: {
                email: PatientDeletedData.email
            },
            data: {
                status: client_1.UserStatus.DELETED
            }
        });
        return PatientDeletedData;
    }));
    return result;
});
const deletePatient = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const patientData = yield prisma_1.prisma.patient.findUniqueOrThrow({
        where: {
            id
        }
    });
    const result = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.medicalReport.deleteMany({
            where: {
                patientId: patientData.id
            }
        });
        yield transactionClient.patientHealthData.delete({
            where: {
                patientId: patientData.id
            }
        });
        const deletedPatientData = yield transactionClient.patient.delete({
            where: {
                id: patientData.id
            }
        });
        yield transactionClient.user.delete({
            where: {
                email: patientData.email
            }
        });
        return deletedPatientData;
    }));
    return result;
});
const updatePatient = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientHealthData, medicalReport } = payload, patientInfo = __rest(payload, ["patientHealthData", "medicalReport"]);
    const userData = yield prisma_1.prisma.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedPatientData = yield transactionClient.patient.update({
            where: {
                id,
                isDeleted: false
            },
            data: patientInfo
        });
        // create or update patient health data
        if (patientHealthData) {
            yield transactionClient.patientHealthData.upsert({
                where: {
                    patientId: userData.id
                },
                update: Object.assign({}, patientHealthData),
                create: Object.assign(Object.assign({}, patientHealthData), { patientId: userData.id })
            });
        }
        // Create medical report if not duplicate
        if (medicalReport) {
            const existingReport = yield transactionClient.medicalReport.findFirst({
                where: {
                    patientId: userData.id,
                    reportName: medicalReport.reportName,
                    reportLink: medicalReport.reportLink
                }
            });
            if (!existingReport) {
                // create medical report
                yield transactionClient.medicalReport.create({
                    data: Object.assign(Object.assign({}, medicalReport), { patientId: userData.id })
                });
            }
        }
        return {
            updatedPatientData
        };
    }));
    const result = yield prisma_1.prisma.patient.findUniqueOrThrow({
        where: {
            id: userData.id
        },
        include: {
            patientHealthData: true,
            medicalReport: true
        }
    });
    return result;
});
exports.PatientServices = {
    getAllFromDB,
    getSinglePatient,
    updatePatient,
    deletePatient,
    softDeletePatient
};
