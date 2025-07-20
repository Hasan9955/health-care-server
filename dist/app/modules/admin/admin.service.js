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
exports.AdminServices = void 0;
const client_1 = require("@prisma/client");
const admin_constant_1 = require("./admin.constant");
const pagination_1 = __importDefault(require("../../utility/pagination"));
const prisma_1 = require("../../utility/prisma");
const getAllFromDB = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const { searchTerm } = query, filterData = __rest(query, ["searchTerm"]);
    const addCondition = [];
    if (query.searchTerm) {
        addCondition.push({
            OR: admin_constant_1.adminSearchableFields.map(field => ({
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
    const result = yield prisma_1.prisma.admin.findMany({
        where: whereCondition,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: {
            [sortBy]: sortOrder
        }
    });
    const total = yield prisma_1.prisma.admin.count({
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
const getSingleAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.admin.findUnique({
        where: {
            id,
            isDeleted: false
        }
    });
    return result;
});
const updateAdmin = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    const result = yield prisma_1.prisma.admin.update({
        where: {
            id,
            isDeleted: false
        },
        data: payload
    });
    return result;
});
const softDeleteAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    const result = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const adminDeletedData = yield transactionClient.admin.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        });
        yield transactionClient.user.update({
            where: {
                email: adminDeletedData.email
            },
            data: {
                status: client_1.UserStatus.BLOCKED
            }
        });
        return adminDeletedData;
    }));
    return result;
});
const deleteAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.admin.findUniqueOrThrow({
        where: {
            id
        }
    });
    const result = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedAdminData = yield transactionClient.admin.delete({
            where: {
                id
            }
        });
        yield transactionClient.user.delete({
            where: {
                email: deletedAdminData.email
            }
        });
        return deletedAdminData;
    }));
});
exports.AdminServices = {
    getAllFromDB,
    getSingleAdmin,
    updateAdmin,
    deleteAdmin,
    softDeleteAdmin
};
