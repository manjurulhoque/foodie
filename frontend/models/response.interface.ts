export interface ErrorDetail {
    message: string;
    code?: string;
}

export interface Response<T> {
    success: boolean;
    message: string;
    data: T;
    errors?: ErrorDetail[];
}
