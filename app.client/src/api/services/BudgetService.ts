/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateBudgetCommand } from '../models/CreateBudgetCommand';
import type { CreateBudgetCommandResponse } from '../models/CreateBudgetCommandResponse';
import type { DeleteBudgetCommandResponse } from '../models/DeleteBudgetCommandResponse';
import type { GetBudgetDetailQueryResponse } from '../models/GetBudgetDetailQueryResponse';
import type { GetBudgetListQueryResponse } from '../models/GetBudgetListQueryResponse';
import type { GetBudgetTransactionListQueryResponse } from '../models/GetBudgetTransactionListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateBudgetCommand } from '../models/UpdateBudgetCommand';
import type { UpdateBudgetCommandResponse } from '../models/UpdateBudgetCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BudgetService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetBudgetListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVBudget(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetBudgetListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Budget',
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
     * @returns CreateBudgetCommandResponse Success
     * @throws ApiError
     */
    public static postApiVBudget(
        version: string,
        requestBody?: CreateBudgetCommand,
    ): CancelablePromise<CreateBudgetCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Budget',
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
     * @returns UpdateBudgetCommandResponse Success
     * @throws ApiError
     */
    public static putApiVBudget(
        version: string,
        requestBody?: UpdateBudgetCommand,
    ): CancelablePromise<UpdateBudgetCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Budget',
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
     * @param id
     * @returns GetBudgetTransactionListQueryResponse Success
     * @throws ApiError
     */
    public static getBudgetTransactionList(
        version: string,
        id?: string,
    ): CancelablePromise<GetBudgetTransactionListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Budget/GetBudgetTransactionList',
            path: {
                'version': version,
            },
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param version
     * @returns GetBudgetDetailQueryResponse Success
     * @throws ApiError
     */
    public static getBudgetById(
        id: string,
        version: string,
    ): CancelablePromise<GetBudgetDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Budget/{id}',
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
     * @returns DeleteBudgetCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteBudget(
        id: string,
        version: string,
    ): CancelablePromise<DeleteBudgetCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/Budget/{id}',
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
