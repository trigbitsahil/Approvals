/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateExpenseCommand } from '../models/CreateExpenseCommand';
import type { CreateExpenseCommandResponse } from '../models/CreateExpenseCommandResponse';
import type { DeleteExpenseCommandResponse } from '../models/DeleteExpenseCommandResponse';
import type { GetExpenseDetailQueryResponse } from '../models/GetExpenseDetailQueryResponse';
import type { GetExpenseListQueryResponse } from '../models/GetExpenseListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateExpenseCommand } from '../models/UpdateExpenseCommand';
import type { UpdateExpenseCommandResponse } from '../models/UpdateExpenseCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExpenseService {
    /**
     * @param version
     * @param expenseTypeId
     * @returns GetExpenseListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVExpense(
        version: string,
        expenseTypeId?: string,
    ): CancelablePromise<GetExpenseListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Expense',
            path: {
                'version': version,
            },
            query: {
                'expenseTypeID': expenseTypeId,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateExpenseCommandResponse Success
     * @throws ApiError
     */
    public static postApiVExpense(
        version: string,
        requestBody?: CreateExpenseCommand,
    ): CancelablePromise<CreateExpenseCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Expense',
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
     * @returns UpdateExpenseCommandResponse Success
     * @throws ApiError
     */
    public static putApiVExpense(
        version: string,
        requestBody?: UpdateExpenseCommand,
    ): CancelablePromise<UpdateExpenseCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Expense',
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
     * @returns GetExpenseDetailQueryResponse Success
     * @throws ApiError
     */
    public static getExpenseById(
        id: string,
        version: string,
    ): CancelablePromise<GetExpenseDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Expense/{id}',
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
     * @returns DeleteExpenseCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteExpense(
        id: string,
        version: string,
    ): CancelablePromise<DeleteExpenseCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/Expense/{id}',
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
