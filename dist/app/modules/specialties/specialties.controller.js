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
exports.specialtyController = void 0;
const catchAsync_1 = __importDefault(require("../../utility/catchAsync"));
const response_1 = __importDefault(require("../../utility/response"));
const specialties_service_1 = require("./specialties.service");
const specialties_validation_1 = require("./specialties.validation");
const insertIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body = specialties_validation_1.specialtiesValidation.createSpecialties.parse(JSON.parse(req.body.data));
    const result = yield specialties_service_1.specialtyServices.insertIntoDB(req);
    (0, response_1.default)(res, {
        message: "Specialty created successfully",
        statusCode: 200,
        data: result
    });
}));
const getAllSpecialties = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield specialties_service_1.specialtyServices.getAllSpecialties();
    (0, response_1.default)(res, {
        message: "Specialties retrieved successfully",
        statusCode: 200,
        data: result
    });
}));
const deleteSpecialties = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield specialties_service_1.specialtyServices.deleteSpecialties(req.params.id);
    (0, response_1.default)(res, {
        message: "Specialty deleted successfully",
        statusCode: 200,
        data: result
    });
}));
exports.specialtyController = {
    insertIntoDB,
    getAllSpecialties,
    deleteSpecialties
};
