type TOptions = {
    page?: number;
    limit?: number;
    sortOrder?: string;
    sortBy?: string;
}

type TOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortOrder: string;
    sortBy: string;
}

const calculatePagination = (options: TOptions): TOptionsResult => {

    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 100;
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy as string;
    const sortOrder = options.sortOrder as string;
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }


}

export default calculatePagination;