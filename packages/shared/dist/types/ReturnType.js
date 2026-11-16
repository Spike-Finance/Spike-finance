"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerResponse = void 0;
class ServerResponse {
    success;
    data;
    message;
    status;
    pagination;
    error;
    constructor({ status, message, data, pagination, error }) {
        this.status = status;
        this.data = data;
        this.error = error;
        this.pagination = pagination;
        this.success = status >= 200 && status < 300;
    }
}
exports.ServerResponse = ServerResponse;
