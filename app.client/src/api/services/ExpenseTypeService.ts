/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateExpenseTypeCommand } from '../models/CreateExpenseTypeCommand';
import type { CreateExpenseTypeCommandResponse } from '../models/CreateExpenseTypeCommandResponse';
import type { DeleteExpenseTypeCommandResponse } from '../models/DeleteExpenseTypeCommandResponse';
import type { GetExpenseTypeDetailQueryResponse } from '../models/GetExpenseTypeDetailQueryResponse';
import type { GetExpenseTypeListQueryResponse } from '../models/GetExpenseTypeListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateExpenseTypeCommand } from '../models/UpdateExpenseTypeCommand';
import type { UpdateExpenseTypeCommandResponse } from '../models/UpdateExpenseTypeCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExpenseTypeService {
    /**
     * @param version
     * @returns GetExpenseTypeListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVExpenseType(
        version: string,
    ): CancelablePromise<GetExpenseTypeListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExpenseType',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateExpenseTypeCommandResponse Success
     * @throws ApiError
     */
    public static postApiVExpenseType(
        version: string,
        requestBody?: CreateExpenseTypeCommand,
    ): CancelablePromise<CreateExpenseTypeCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ExpenseType',
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
     * @returns UpdateExpenseTypeCommandResponse Success
     * @throws ApiError
     */
    public static putApiVExpenseType(
        version: string,
        requestBody?: UpdateExpenseTypeCommand,
    ): CancelablePromise<UpdateExpenseTypeCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ExpenseType',
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
     * @returns GetExpenseTypeDetailQueryResponse Success
     * @throws ApiError
     */
    public static getExpenseTypeById(
        id: string,
        version: string,
    ): CancelablePromise<GetExpenseTypeDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExpenseType/{id}',
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
     * @returns DeleteExpenseTypeCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteExpenseType(
        id: string,
        version: string,
    ): CancelablePromise<DeleteExpenseTypeCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ExpenseType/{id}',
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
