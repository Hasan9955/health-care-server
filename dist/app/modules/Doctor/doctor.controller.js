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
exports.doctorControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utility/catchAsync"));
const doctor_service_1 = require("./doctor.service");
const response_1 = __importDefault(require("../../utility/response"));
const pick_1 = __importDefault(require("../../utility/pick"));
const doctor_constant_1 = require("./doctor.constant");
const getAllDoctors = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const filterQuery = (0, pick_1.default)(query, doctor_constant_1.doctorFilterableFields);
    const options = (0, pick_1.default)(query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = yield doctor_service_1.doctorServices.getAllDoctors(filterQuery, options);
    (0, response_1.default)(res, {
        message: "Doctor retrieved successfully",
        statusCode: 200,
        meta: result.meta,
        data: result.data
    });
}));
const getSingleDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield doctor_service_1.doctorServices.getSingleDoctor(req.params.id);
    (0, response_1.default)(res, {
        message: "Doctor updated successfully",
        statusCode: 200,
        data: result
    });
}));
const softDeleteDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield doctor_service_1.doctorServices.softDeleteDoctor(req.params.id);
    (0, response_1.default)(res, {
        message: "Doctor deleted successfully",
        statusCode: 200,
        data: result
    });
}));
const deleteDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield doctor_service_1.doctorServices.deleteDoctor(req.params.id);
    (0, response_1.default)(res, {
        message: "Doctor deleted successfully",
        statusCode: 200,
        data: result
    });
}));
const updateDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body = JSON.parse(req.body.data);
    const result = yield doctor_service_1.doctorServices.updateDoctor(req);
    (0, response_1.default)(res, {
        message: "Doctor updated successfully",
        statusCode: 200,
        data: result
    });
}));
exports.doctorControllers = {
    updateDoctor,
    getAllDoctors,
    getSingleDoctor,
    deleteDoctor,
    softDeleteDoctor
};
