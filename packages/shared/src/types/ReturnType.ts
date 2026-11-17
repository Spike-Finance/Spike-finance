export class ServerResponse<T> {
    success: boolean;
    data: T | null;
    message?: string;
    status: number;
    pagination?: {
        page: number;
        limit: number;
        total: number;
    };
    error?: any;

    constructor({ status, message, data, pagination, error }: {
        status: number, message?: string, data: T | null, error?: any, pagination?: {
            page: number;
            limit: number;
            total: number;
        }
    }) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.error = error;
        this.pagination = pagination;
        this.success = status >= 200 && status < 300;
    }
}