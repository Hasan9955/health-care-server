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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorScheduleController = void 0;
const catchAsync_1 = __importDefault(require("../../utility/catchAsync"));
const pick_1 = __importDefault(require("../../utility/pick"));
const response_1 = __importDefault(require("../../utility/response"));
const doctorSchedule_service_1 = require("./doctorSchedule.service");
const getDoctorSchedules = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const user = req.user;
    const filterQuery = (0, pick_1.default)(query, ['startDateTime', 'endDateTime', 'isBooked']);
    const options = (0, pick_1.default)(query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = yield doctorSchedule_service_1.doctorScheduleServices.getDoctorSchedules(user, filterQuery, options);
    (0, response_1.default)(res, {
        message: "Doctor Schedules retrieved successfully",
        statusCode: 200,
        data: result
    });
}));
const createDoctorSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield doctorSchedule_service_1.doctorScheduleServices.createDoctorSchedule(user, req.body);
    (0, response_1.default)(res, {
        message: "Doctor schedule created successfully!",
        statusCode: 200,
        data: result
    });
}));
const deleteFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const id = req.params.id;
    const result = yield doctorSchedule_service_1.doctorScheduleServices.deleteFromDB(user, id);
    (0, response_1.default)(res, {
        message: "Doctor schedule deleted successfully!",
        statusCode: 200,
        data: result
    });
}));
exports.doctorScheduleController = {
    createDoctorSchedule,
    getDoctorSchedules,
    deleteFromDB
};
