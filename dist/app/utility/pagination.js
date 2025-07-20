"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculatePagination = (options) => {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 100;
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy;
    const sortOrder = options.sortOrder;
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    };
};
exports.default = calculatePagination;
