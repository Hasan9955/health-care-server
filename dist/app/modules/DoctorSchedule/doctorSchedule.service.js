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
exports.doctorScheduleServices = void 0;
const prisma_1 = require("../../utility/prisma");
const pagination_1 = __importDefault(require("../../utility/pagination"));
const appError_1 = __importDefault(require("../../error/appError"));
const getDoctorSchedules = (user, query, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const { startDateTime, endDateTime } = query, filterData = __rest(query, ["startDateTime", "endDateTime"]);
    const andCondition = [];
    if (startDateTime && endDateTime) {
        andCondition.push({
            schedule: {
                startDateTime: { gte: startDateTime },
                endDateTime: { lte: endDateTime }
            }
        });
    }
    if (Object.keys(filterData).length > 0) {
        if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'true') {
            filterData.isBooked = true;
        }
        else if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'false') {
            filterData.isBooked = false;
        }
        else {
            filterData.isBooked = undefined;
        }
        andCondition.push(...Object.keys(filterData).map(key => ({
            [key]: { equals: filterData[key] }
        })));
    }
    const whereCondition = andCondition.length > 0 ? { AND: andCondition } : {};
    const orderBy = sortBy && sortOrder ? { [sortBy]: sortOrder } : {};
    const result = yield prisma_1.prisma.doctorSchedules.findMany({
        where: Object.assign(Object.assign({}, whereCondition), { doctor: {
                email: user.email
            } }),
        skip: (page - 1) * limit,
        take: limit,
        orderBy
    });
    const total = yield prisma_1.prisma.doctorSchedules.count({ where: Object.assign(Object.assign({}, whereCondition), { doctor: {
                email: user.email
            } }) });
    return {
        meta: {
            page,
            limit,
            total,
            skip: (page - 1) * limit
        },
        data: {
            result
        }
    };
});
const createDoctorSchedule = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorData = yield prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
    const doctorScheduleData = payload.scheduleIds.map(scheduleId => ({
        doctorId: doctorData.id,
        scheduleId
    }));
    const result = yield prisma_1.prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    });
    return result;
});
const deleteFromDB = (user, scheduleId) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorData = yield prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
    const isScheduleBooked = yield prisma_1.prisma.doctorSchedules.findFirst({
        where: {
            doctorId: doctorData.id,
            scheduleId,
            isBooked: true
        }
    });
    if (isScheduleBooked) {
        throw new appError_1.default(400, 'You can not delete a booked schedule!');
    }
    const result = yield prisma_1.prisma.doctorSchedules.delete({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId
            }
        }
    });
    return result;
});
exports.doctorScheduleServices = {
    createDoctorSchedule,
    getDoctorSchedules,
    deleteFromDB
};
