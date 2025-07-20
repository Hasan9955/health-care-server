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
exports.doctorServices = void 0;
const prisma_1 = require("../../utility/prisma");
const fileUploader_1 = require("../../utility/fileUploader");
const pagination_1 = __importDefault(require("../../utility/pagination"));
const doctor_constant_1 = require("./doctor.constant");
const getAllDoctors = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const { searchTerm, specialties } = query, filterData = __rest(query, ["searchTerm", "specialties"]);
    const addCondition = [];
    if (query.searchTerm) {
        addCondition.push({
            OR: doctor_constant_1.doctorSearchableFields.map(field => ({
                [field]: {
                    contains: query.searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    if (specialties && specialties.length > 0) {
        addCondition.push({
            doctorSpecialties: {
                some: {
                    specialties: {
                        title: {
                            contains: specialties,
                            mode: 'insensitive'
                        }
                    }
                }
            }
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
    const result = yield prisma_1.prisma.doctor.findMany({
        where: whereCondition,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
    });
    const total = yield prisma_1.prisma.doctor.count({
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
const getSingleDoctor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
    });
    return result;
});
const softDeleteDoctor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });
    const result = yield prisma_1.prisma.doctor.update({
        where: {
            id
        },
        data: {
            isDeleted: true
        }
    });
    return result;
});
const deleteDoctor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });
    const result = yield prisma_1.prisma.doctor.delete({
        where: {
            id
        }
    });
    return result;
});
const updateDoctor = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const _a = req.body, { specialties } = _a, payload = __rest(_a, ["specialties"]);
    const file = req.file;
    const doctorData = yield prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            id
        },
        include: {
            doctorSpecialties: true
        }
    });
    if (file) {
        const uploadFile = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        payload.profilePhoto = uploadFile === null || uploadFile === void 0 ? void 0 : uploadFile.url;
    }
    yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.doctor.update({
            where: {
                id
            },
            data: payload,
            include: {
                doctorSpecialties: true
            }
        });
        if (specialties && specialties.length > 0) {
            //Delete specialties 
            const deleteSpecialtiesArray = specialties.filter((specialty) => specialty.isDeleted);
            for (const specialty of deleteSpecialtiesArray) {
                yield transactionClient.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: doctorData.id,
                        specialtiesId: specialty.specialtiesId
                    }
                });
            }
            //Create Specialties
            const createSpecialtiesArray = specialties.filter((specialty) => {
                return !specialty.isDeleted && !doctorData.doctorSpecialties.map(special => special.specialtiesId).includes(specialty.specialtiesId);
            });
            for (const specialty of createSpecialtiesArray) {
                yield transactionClient.doctorSpecialties.create({
                    data: {
                        doctorId: doctorData.id,
                        specialtiesId: specialty.specialtiesId
                    }
                });
            }
        }
    }));
    const result = yield prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            id: doctorData.id
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
    });
    return result;
});
exports.doctorServices = {
    getAllDoctors,
    getSingleDoctor,
    updateDoctor,
    softDeleteDoctor,
    deleteDoctor
};
