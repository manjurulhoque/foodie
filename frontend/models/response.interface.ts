export interface ErrorDetail {
    message: string;
    code?: string;
}

export interface Response<T> {
    data: T;
    message: string;
    success: boolean;
    errors: ErrorDetail[];
}
