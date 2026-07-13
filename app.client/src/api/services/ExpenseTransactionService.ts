/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateExpenseTransactionCommand } from '../models/CreateExpenseTransactionCommand';
import type { CreateExpenseTransactionCommandResponse } from '../models/CreateExpenseTransactionCommandResponse';
import type { DeleteExpenseTransactionCommandResponse } from '../models/DeleteExpenseTransactionCommandResponse';
import type { GetExpenseTransactionDetailQueryResponse } from '../models/GetExpenseTransactionDetailQueryResponse';
import type { GetExpenseTransactionListForApprovalQueryResponse } from '../models/GetExpenseTransactionListForApprovalQueryResponse';
import type { GetExpenseTransactionListQueryResponse } from '../models/GetExpenseTransactionListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateExpenseTransactionCommand } from '../models/UpdateExpenseTransactionCommand';
import type { UpdateExpenseTransactionCommandResponse } from '../models/UpdateExpenseTransactionCommandResponse';
import type { GetExpenseTransactionSearchQueryResponse } from '../models/GetExpenseTransactionSearchQueryResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExpenseTransactionService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetExpenseTransactionListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVExpenseTransaction(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetExpenseTransactionListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExpenseTransaction',
            path: {
                'version': version,
            },
            query: {
                'category': category,
                'categoryID': categoryId,
            },
        });
    }
    public static getApiVExpenseTransaction2(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetExpenseTransactionListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/expensetransaction/GetExpenseTransactionList2',
            path: {
                'version': version,
            },
            query: {
                'category': category,
                'categoryID': categoryId,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateExpenseTransactionCommandResponse Success
     * @throws ApiError
     */
    public static postApiVExpenseTransaction(
        version: string,
        requestBody?: CreateExpenseTransactionCommand,
    ): CancelablePromise<CreateExpenseTransactionCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ExpenseTransaction',
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
     * @returns UpdateExpenseTransactionCommandResponse Success
     * @throws ApiError
     */
    public static putApiVExpenseTransaction(
        version: string,
        requestBody?: UpdateExpenseTransactionCommand,
    ): CancelablePromise<UpdateExpenseTransactionCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ExpenseTransaction',
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
     * @returns GetExpenseTransactionListForApprovalQueryResponse Success
     * @throws ApiError
     */
    public static getExpenseTransactionListForApproval(
        version: string,
    ): CancelablePromise<GetExpenseTransactionListForApprovalQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExpenseTransaction/GetExpenseTransactionListForApproval',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param id
     * @param version
     * @returns GetExpenseTransactionDetailQueryResponse Success
     * @throws ApiError
     */
    public static getExpenseTransactionById(
        id: string,
        version: string,
    ): CancelablePromise<GetExpenseTransactionDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExpenseTransaction/{id}',
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
     * @returns DeleteExpenseTransactionCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteExpenseTransaction(
        id: string,
        version: string,
    ): CancelablePromise<DeleteExpenseTransactionCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ExpenseTransaction/{id}',
            path: {
                'id': id,
                'version': version,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
        * @param version
        * @param mediaId
        * @param expenseId
        * @param expenseTypeId
        * @returns GetExpenseTransactionSearchQueryResponse Success
        * @throws ApiError
        */
    public static getExpenseTransactionSearch(
        version: string,
        mediaId?: string,
        expenseId?: string,
        expenseTypeId?: string,
        vendorId?: string,
    ): CancelablePromise<GetExpenseTransactionSearchQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExpenseTransaction/GetExpenseTransactionSearch',
            path: {
                'version': version,
            },
            query: {
                'mediaId': mediaId,
                'expenseId': expenseId,
                'expenseTypeId': expenseTypeId,
                'vendorId': vendorId,
            },
        });
    }
}
