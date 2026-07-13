/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateExpenseCategoryCommand } from '../models/CreateExpenseCategoryCommand';
import type { CreateExpenseCategoryCommandResponse } from '../models/CreateExpenseCategoryCommandResponse';
import type { DeleteExpenseCategoryCommandResponse } from '../models/DeleteExpenseCategoryCommandResponse';
import type { GetExpenseCategoryDetailQueryResponse } from '../models/GetExpenseCategoryDetailQueryResponse';
import type { GetExpenseCategoryListQueryResponse } from '../models/GetExpenseCategoryListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateExpenseCategoryCommand } from '../models/UpdateExpenseCategoryCommand';
import type { UpdateExpenseCategoryCommandResponse } from '../models/UpdateExpenseCategoryCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExpenseCategoryService {
    /**
     * @param version
     * @returns GetExpenseCategoryListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVExpenseCategory(
        version: string,
    ): CancelablePromise<GetExpenseCategoryListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExpenseCategory',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateExpenseCategoryCommandResponse Success
     * @throws ApiError
     */
    public static postApiVExpenseCategory(
        version: string,
        requestBody?: CreateExpenseCategoryCommand,
    ): CancelablePromise<CreateExpenseCategoryCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ExpenseCategory',
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
     * @returns UpdateExpenseCategoryCommandResponse Success
     * @throws ApiError
     */
    public static putApiVExpenseCategory(
        version: string,
        requestBody?: UpdateExpenseCategoryCommand,
    ): CancelablePromise<UpdateExpenseCategoryCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ExpenseCategory',
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
     * @returns GetExpenseCategoryDetailQueryResponse Success
     * @throws ApiError
     */
    public static getExpenseCategoryById(
        id: string,
        version: string,
    ): CancelablePromise<GetExpenseCategoryDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExpenseCategory/{id}',
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
     * @returns DeleteExpenseCategoryCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteExpenseCategory(
        id: string,
        version: string,
    ): CancelablePromise<DeleteExpenseCategoryCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ExpenseCategory/{id}',
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
