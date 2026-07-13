/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTaskRecurrenceTransactionCommand } from '../models/CreateTaskRecurrenceTransactionCommand';
import type { CreateTaskRecurrenceTransactionCommandResponse } from '../models/CreateTaskRecurrenceTransactionCommandResponse';
import type { DeleteTaskRecurrenceTransactionCommandResponse } from '../models/DeleteTaskRecurrenceTransactionCommandResponse';
import type { GetTaskRecurrenceTransactionDetailQueryResponse } from '../models/GetTaskRecurrenceTransactionDetailQueryResponse';
import type { GetTaskRecurrenceTransactionListQueryResponse } from '../models/GetTaskRecurrenceTransactionListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateTaskRecurrenceTransactionCommand } from '../models/UpdateTaskRecurrenceTransactionCommand';
import type { UpdateTaskRecurrenceTransactionCommandResponse } from '../models/UpdateTaskRecurrenceTransactionCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaskRecurrenceTransactionService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetTaskRecurrenceTransactionListQueryResponse Success
     * @throws ApiError
     */
    public static taskRecurrenceTransactionGet(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetTaskRecurrenceTransactionListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaskRecurrenceTransaction',
            path: {
                'version': version,
            },
            query: {
                'category': category,
                'categoryId': categoryId,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateTaskRecurrenceTransactionCommandResponse Success
     * @throws ApiError
     */
    public static taskRecurrenceTransactionPost(
        version: string,
        requestBody?: CreateTaskRecurrenceTransactionCommand,
    ): CancelablePromise<CreateTaskRecurrenceTransactionCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/TaskRecurrenceTransaction',
            path: {
                'version': version,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns UpdateTaskRecurrenceTransactionCommandResponse Success
     * @throws ApiError
     */
    public static taskRecurrenceTransactionPut(
        version: string,
        requestBody?: UpdateTaskRecurrenceTransactionCommand,
    ): CancelablePromise<UpdateTaskRecurrenceTransactionCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/TaskRecurrenceTransaction',
            path: {
                'version': version,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param id
     * @param version
     * @returns GetTaskRecurrenceTransactionDetailQueryResponse Success
     * @throws ApiError
     */
    public static getTaskRecurrenceTransactionById(
        id: string,
        version: string,
    ): CancelablePromise<GetTaskRecurrenceTransactionDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaskRecurrenceTransaction/{id}',
            path: {
                'id': id,
                'version': version,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
     * @param id
     * @param version
     * @returns DeleteTaskRecurrenceTransactionCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteTaskRecurrenceTransaction(
        id: string,
        version: string,
    ): CancelablePromise<DeleteTaskRecurrenceTransactionCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/TaskRecurrenceTransaction/{id}',
            path: {
                'id': id,
                'version': version,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
