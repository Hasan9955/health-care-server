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
exports.userServices = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../../utility/prisma");
const fileUploader_1 = require("../../utility/fileUploader");
const pagination_1 = __importDefault(require("../../utility/pagination"));
const user_constant_1 = require("./user.constant");
const createAdmin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const payload = req.body;
    if (file) {
        const uploadFile = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        payload.admin.profilePhoto = uploadFile === null || uploadFile === void 0 ? void 0 : uploadFile.url;
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 10);
    const userData = {
        email: payload.admin.email,
        password: hashedPassword,
        role: client_1.UserRole.ADMIN
    };
    const result = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const createdUserData = yield transactionClient.user.create({
            data: userData
        });
        const createdAdminData = yield transactionClient.admin.create({
            data: payload.admin
        });
        return {
            createdUserData,
            createdAdminData
        };
    }));
    return result;
});
const createDoctor = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const payload = req.body;
    if (file) {
        const uploadFile = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        payload.doctor.profilePhoto = uploadFile === null || uploadFile === void 0 ? void 0 : uploadFile.url;
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 10);
    const userData = {
        email: payload.doctor.email,
        password: hashedPassword,
        role: client_1.UserRole.DOCTOR
    };
    const result = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const createdUserData = yield transactionClient.user.create({
            data: userData
        });
        const createdDoctorData = yield transactionClient.doctor.create({
            data: payload.doctor
        });
        return {
            createdUserData,
            createdDoctorData
        };
    }));
    return result;
});
const createPatient = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const payload = req.body;
    if (file) {
        const uploadFile = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        payload.patient.profilePhoto = uploadFile === null || uploadFile === void 0 ? void 0 : uploadFile.url;
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 10);
    const userData = {
        email: payload.patient.email,
        password: hashedPassword,
        role: client_1.UserRole.PATIENT
    };
    const result = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const createdUserData = yield transactionClient.user.create({
            data: userData
        });
        const createdPatientData = yield transactionClient.patient.create({
            data: payload.patient
        });
        return {
            createdUserData,
            createdPatientData
        };
    }));
    return result;
});
const getAllFromDB = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const { searchTerm } = query, filterData = __rest(query, ["searchTerm"]);
    const andConditions = [];
    if (query.searchTerm) {
        andConditions.push({
            OR: user_constant_1.userSearchableFields.map(field => ({
                [field]: {
                    contains: query.searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    // console.dir(andConditions, { depth: Infinity });
    const whereCondition = { AND: andConditions };
    // console.dir(whereCondition, { depth: Infinity });
    const result = yield prisma_1.prisma.user.findMany({
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
    });
    const total = yield prisma_1.prisma.user.count({
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
const myProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
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
    });
    return userData;
});
const updateMyProfile = (user, req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const payload = req.body;
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    if (file) {
        const uploadFile = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        payload.profilePhoto = uploadFile === null || uploadFile === void 0 ? void 0 : uploadFile.url;
    }
    let result;
    if (userData.role === client_1.UserRole.PATIENT) {
        result = yield prisma_1.prisma.patient.update({
            where: {
                email: userData.email
            },
            data: payload
        });
    }
    if (userData.role === client_1.UserRole.DOCTOR) {
        result = yield prisma_1.prisma.doctor.update({
            where: {
                email: userData.email
            },
            data: payload
        });
    }
    if (userData.role === client_1.UserRole.ADMIN || userData.role === client_1.UserRole.SUPER_ADMIN) {
        result = yield prisma_1.prisma.admin.update({
            where: {
                email: userData.email
            },
            data: payload
        });
    }
    return result;
});
exports.userServices = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB,
    myProfile,
    updateMyProfile
};
