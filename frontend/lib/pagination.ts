export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const DEFAULT_PAGE_SIZE = 9;
export const DEFAULT_PAGE = 1;

export const getPaginationParams = (query: any): PaginationParams => {
    const page = Number(query?.page) || DEFAULT_PAGE;
    const limit = Number(query?.limit) || DEFAULT_PAGE_SIZE;
    return { page, limit };
};

export const getPaginatedData = <T>(
    data: T[],
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_PAGE_SIZE
): PaginatedResponse<T> => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = data.slice(startIndex, endIndex);
    const total = data.length;
    const totalPages = Math.ceil(total / limit);

    return {
        success: true,
        message: "Data fetched successfully",
        data: paginatedData,
        meta: {
            total,
            page,
            limit,
            totalPages,
        },
    };
};
