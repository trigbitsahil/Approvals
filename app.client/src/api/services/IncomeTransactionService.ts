/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateIncomeTransactionCommand } from '../models/CreateIncomeTransactionCommand';
import type { CreateIncomeTransactionCommandResponse } from '../models/CreateIncomeTransactionCommandResponse';
import type { DeleteIncomeTransactionCommandResponse } from '../models/DeleteIncomeTransactionCommandResponse';
import type { GetIncomeTransactionDetailQueryResponse } from '../models/GetIncomeTransactionDetailQueryResponse';
import type { GetIncomeTransactionListForApprovalQueryResponse } from '../models/GetIncomeTransactionListForApprovalQueryResponse';
import type { GetIncomeTransactionListQueryResponse } from '../models/GetIncomeTransactionListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateIncomeTransactionCommand } from '../models/UpdateIncomeTransactionCommand';
import type { UpdateIncomeTransactionCommandResponse } from '../models/UpdateIncomeTransactionCommandResponse';
import type { GetIncomeTransactionSearchQueryResponse } from '../models/GetIncomeTransactionSearchQueryResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class IncomeTransactionService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetIncomeTransactionListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVIncomeTransaction(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetIncomeTransactionListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/IncomeTransaction',
            path: {
                'version': version,
            },
            query: {
                'category': category,
                'categoryID': categoryId,
            },
        });
    }
    public static getApiVIncomeTransaction2(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetIncomeTransactionListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/incometransaction/GetIncomeTransactionList2',
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
     * @returns CreateIncomeTransactionCommandResponse Success
     * @throws ApiError
     */
    public static postApiVIncomeTransaction(
        version: string,
        requestBody?: CreateIncomeTransactionCommand,
    ): CancelablePromise<CreateIncomeTransactionCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IncomeTransaction',
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
     * @returns UpdateIncomeTransactionCommandResponse Success
     * @throws ApiError
     */
    public static putApiVIncomeTransaction(
        version: string,
        requestBody?: UpdateIncomeTransactionCommand,
    ): CancelablePromise<UpdateIncomeTransactionCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/IncomeTransaction',
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
     * @returns GetIncomeTransactionListForApprovalQueryResponse Success
     * @throws ApiError
     */
    public static getIncomeTransactionListForApproval(
        version: string,
    ): CancelablePromise<GetIncomeTransactionListForApprovalQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/IncomeTransaction/GetIncomeTransactionListForApproval',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param id
     * @param version
     * @returns GetIncomeTransactionDetailQueryResponse Success
     * @throws ApiError
     */
    public static getIncomeTransactionById(
        id: string,
        version: string,
    ): CancelablePromise<GetIncomeTransactionDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/IncomeTransaction/{id}',
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
     * @returns DeleteIncomeTransactionCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteIncomeTransaction(
        id: string,
        version: string,
    ): CancelablePromise<DeleteIncomeTransactionCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/IncomeTransaction/{id}',
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
        * @param incomeId
        * @param incomeTypeId
        * @returns GetIncomeTransactionSearchQueryResponse Success
        * @throws ApiError
        */
    public static getIncomeTransactionSearch(
        version: string,
        mediaId?: string,
        incomeId?: string,
        incomeTypeId?: string,
        customerId?: string,
    ): CancelablePromise<GetIncomeTransactionSearchQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/IncomeTransaction/GetIncomeTransactionSearch',
            path: {
                'version': version,
            },
            query: {
                'mediaId': mediaId,
                'incomeId': incomeId,
                'incomeTypeId': incomeTypeId,
                'customerId': customerId,
            },
        });
    }

    /**
     * @param version
     * @param mediaId
     * @param customerId
     * @returns any Success
     * @throws ApiError
     */
    public static getIncomeTransactionListByCustomer(
        version: string,
        mediaId?: string,
        customerId?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/IncomeTransaction/GetIncomeTransactionListByCustomer',
            path: {
                'version': version,
            },
            query: {
                'mediaId': mediaId,
                'customerId': customerId,
            },
        });
    }
}
