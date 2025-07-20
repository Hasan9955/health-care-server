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
exports.PatientControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utility/catchAsync"));
const pick_1 = __importDefault(require("../../utility/pick"));
const response_1 = __importDefault(require("../../utility/response"));
const patient_constant_1 = require("./patient.constant");
const patient_service_1 = require("./patient.service");
const getAllPatients = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const filterQuery = (0, pick_1.default)(query, patient_constant_1.patientFilterableFields);
    const options = (0, pick_1.default)(query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = yield patient_service_1.PatientServices.getAllFromDB(filterQuery, options);
    (0, response_1.default)(res, {
        message: "All Patients retrieved successfully",
        statusCode: 200,
        meta: result === null || result === void 0 ? void 0 : result.meta,
        data: result === null || result === void 0 ? void 0 : result.data
    });
}));
const getSinglePatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield patient_service_1.PatientServices.getSinglePatient(id);
    (0, response_1.default)(res, {
        message: "Patient data retrieved successfully",
        statusCode: 200,
        data: result
    });
}));
const updatePatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const result = yield patient_service_1.PatientServices.updatePatient(id, payload);
    (0, response_1.default)(res, {
        message: "Patient data updated successfully",
        statusCode: 200,
        data: result
    });
}));
const softDeletePatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield patient_service_1.PatientServices.softDeletePatient(id);
    (0, response_1.default)(res, {
        message: "Patient deleted successfully",
        statusCode: 200,
        data: result
    });
}));
const deletePatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield patient_service_1.PatientServices.deletePatient(id);
    (0, response_1.default)(res, {
        message: "Patient deleted successfully",
        statusCode: 200,
        data: result
    });
}));
exports.PatientControllers = {
    getAllPatients,
    getSinglePatient,
    updatePatient,
    deletePatient,
    softDeletePatient
};
