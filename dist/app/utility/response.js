"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, payload) => {
    res.status(payload.statusCode).json({
        success: true,
        message: payload.message,
        status: payload.statusCode,
        meta: (payload === null || payload === void 0 ? void 0 : payload.meta) || null || undefined,
        data: (payload === null || payload === void 0 ? void 0 : payload.data) || null || undefined
    });
};
exports.default = sendResponse;
