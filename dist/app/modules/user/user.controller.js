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
exports.userControllers = void 0;
const user_service_1 = require("./user.service");
const catchAsync_1 = __importDefault(require("../../utility/catchAsync"));
const user_validation_1 = require("./user.validation");
const user_constant_1 = require("./user.constant");
const response_1 = __importDefault(require("../../utility/response"));
const pick_1 = __importDefault(require("../../utility/pick"));
const createAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body = user_validation_1.userValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data));
    const result = yield user_service_1.userServices.createAdmin(req);
    res.status(200).json({
        success: true,
        status: 200,
        message: 'Admin created successfully!',
        data: result
    });
}));
const createDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body = user_validation_1.userValidation.createDoctorValidationSchema.parse(JSON.parse(req.body.data));
    const result = yield user_service_1.userServices.createDoctor(req);
    res.status(200).json({
        success: true,
        status: 200,
        message: 'Doctor created successfully!',
        data: result
    });
}));
const createPatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body = user_validation_1.userValidation.createPatientValidationSchema.parse(JSON.parse(req.body.data));
    const result = yield user_service_1.userServices.createPatient(req);
    res.status(200).json({
        success: true,
        status: 200,
        message: 'Patient created successfully!',
        data: result
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const filterQuery = (0, pick_1.default)(query, user_constant_1.userFilterableFields);
    const options = (0, pick_1.default)(query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = yield user_service_1.userServices.getAllFromDB(filterQuery, options);
    (0, response_1.default)(res, {
        message: "Users retrieved successfully",
        statusCode: 200,
        meta: result.meta,
        data: result.data
    });
}));
const myProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.myProfile(req.user);
    (0, response_1.default)(res, {
        message: "profile data retrieved successfully",
        statusCode: 200,
        data: result
    });
}));
const updateMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body = JSON.parse(req.body.data);
    const user = req.user;
    const result = yield user_service_1.userServices.updateMyProfile(user, req);
    (0, response_1.default)(res, {
        message: "profile updated successfully",
        statusCode: 200,
        data: result
    });
}));
exports.userControllers = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUsers,
    myProfile,
    updateMyProfile
};
