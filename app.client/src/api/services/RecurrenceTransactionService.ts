/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRecurrenceTransactionCommand } from '../models/CreateRecurrenceTransactionCommand';
import type { CreateRecurrenceTransactionCommandResponse } from '../models/CreateRecurrenceTransactionCommandResponse';
import type { DeleteRecurrenceTransactionCommandResponse } from '../models/DeleteRecurrenceTransactionCommandResponse';
import type { GetRecurrenceTransactionDetailQueryResponse } from '../models/GetRecurrenceTransactionDetailQueryResponse';
import type { GetRecurrenceTransactionListQueryResponse } from '../models/GetRecurrenceTransactionListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateRecurrenceTransactionCommand } from '../models/UpdateRecurrenceTransactionCommand';
import type { UpdateRecurrenceTransactionCommandResponse } from '../models/UpdateRecurrenceTransactionCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RecurrenceTransactionService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetRecurrenceTransactionListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVRecurrenceTransaction(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetRecurrenceTransactionListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RecurrenceTransaction',
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
     * @returns CreateRecurrenceTransactionCommandResponse Success
     * @throws ApiError
     */
    public static postApiVRecurrenceTransaction(
        version: string,
        requestBody?: CreateRecurrenceTransactionCommand,
    ): CancelablePromise<CreateRecurrenceTransactionCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/RecurrenceTransaction',
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
     * @returns UpdateRecurrenceTransactionCommandResponse Success
     * @throws ApiError
     */
    public static putApiVRecurrenceTransaction(
        version: string,
        requestBody?: UpdateRecurrenceTransactionCommand,
    ): CancelablePromise<UpdateRecurrenceTransactionCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/RecurrenceTransaction',
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
     * @returns GetRecurrenceTransactionDetailQueryResponse Success
     * @throws ApiError
     */
    public static getRecurrenceTransactionById(
        id: string,
        version: string,
    ): CancelablePromise<GetRecurrenceTransactionDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RecurrenceTransaction/{id}',
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
     * @returns DeleteRecurrenceTransactionCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteRecurrenceTransaction(
        id: string,
        version: string,
    ): CancelablePromise<DeleteRecurrenceTransactionCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/RecurrenceTransaction/{id}',
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
