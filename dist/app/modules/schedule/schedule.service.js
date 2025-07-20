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
exports.scheduleServices = void 0;
const date_fns_1 = require("date-fns");
const prisma_1 = require("../../utility/prisma");
const pagination_1 = __importDefault(require("../../utility/pagination"));
const getAllSchedules = (user, query, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const { startDateTime, endDateTime } = query, filterData = __rest(query, ["startDateTime", "endDateTime"]);
    const addCondition = [];
    if (startDateTime && endDateTime) {
        addCondition.push({
            AND: [
                {
                    startDateTime: {
                        gte: startDateTime
                    }
                },
                {
                    endDateTime: {
                        lte: endDateTime
                    }
                }
            ]
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
    const whereCondition = { AND: addCondition };
    const doctorSchedules = yield prisma_1.prisma.doctorSchedules.findMany({
        where: {
            doctor: {
                email: user.email
            }
        }
    });
    const doctorSchedulesIds = doctorSchedules.map(schedule => schedule.scheduleId);
    const result = yield prisma_1.prisma.schedule.findMany({
        where: Object.assign(Object.assign({}, whereCondition), { id: {
                notIn: doctorSchedulesIds
            } }),
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { startDateTime: 'asc' }
    });
    const total = yield prisma_1.prisma.schedule.count({
        where: Object.assign(Object.assign({}, whereCondition), { id: {
                notIn: doctorSchedulesIds
            } })
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
const insertIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate, startTime, endTime } = payload;
    const schedules = [];
    const intervalTime = 30;
    const beginDate = new Date(startDate);
    const lastDate = new Date(endDate);
    while (beginDate <= lastDate) {
        const startDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(beginDate, 'yyyy-MM-dd')}`, Number(startTime.split(':')[0])), Number(startTime.split(':')[1])));
        const endDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(beginDate, 'yyyy-MM-dd')}`, Number(endTime.split(':')[0])), Number(endTime.split(':')[1])));
        while (startDateTime < endDateTime) {
            const scheduleData = {
                startDateTime,
                endDateTime: (0, date_fns_1.addMinutes)(startDateTime, intervalTime)
            };
            const isExists = yield prisma_1.prisma.schedule.findFirst({
                where: {
                    startDateTime: scheduleData.startDateTime,
                    endDateTime: scheduleData.endDateTime
                }
            });
            if (!isExists) {
                const result = yield prisma_1.prisma.schedule.create({
                    data: scheduleData
                });
                schedules.push(result);
            }
            startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
        }
        beginDate.setDate(beginDate.getDate() + 1);
    }
    return schedules;
});
exports.scheduleServices = {
    insertIntoDB,
    getAllSchedules
};
