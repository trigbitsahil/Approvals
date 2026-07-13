/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateIncomeCommand } from '../models/CreateIncomeCommand';
import type { CreateIncomeCommandResponse } from '../models/CreateIncomeCommandResponse';
import type { DeleteIncomeCommandResponse } from '../models/DeleteIncomeCommandResponse';
import type { GetIncomeDetailQueryResponse } from '../models/GetIncomeDetailQueryResponse';
import type { GetIncomeListQueryResponse } from '../models/GetIncomeListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateIncomeCommand } from '../models/UpdateIncomeCommand';
import type { UpdateIncomeCommandResponse } from '../models/UpdateIncomeCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class IncomeService {
    /**
     * @param version
     * @param incomeTypeId
     * @returns GetIncomeListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVIncome(
        version: string,
        incomeTypeId?: string,
    ): CancelablePromise<GetIncomeListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Income',
            path: {
                'version': version,
            },
            query: {
                'incomeTypeID': incomeTypeId,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateIncomeCommandResponse Success
     * @throws ApiError
     */
    public static postApiVIncome(
        version: string,
        requestBody?: CreateIncomeCommand,
    ): CancelablePromise<CreateIncomeCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Income',
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
     * @returns UpdateIncomeCommandResponse Success
     * @throws ApiError
     */
    public static putApiVIncome(
        version: string,
        requestBody?: UpdateIncomeCommand,
    ): CancelablePromise<UpdateIncomeCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Income',
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
     * @returns GetIncomeDetailQueryResponse Success
     * @throws ApiError
     */
    public static getIncomeById(
        id: string,
        version: string,
    ): CancelablePromise<GetIncomeDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Income/{id}',
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
     * @returns DeleteIncomeCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteIncome(
        id: string,
        version: string,
    ): CancelablePromise<DeleteIncomeCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/Income/{id}',
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
