/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateIncomeTypeCommand } from '../models/CreateIncomeTypeCommand';
import type { CreateIncomeTypeCommandResponse } from '../models/CreateIncomeTypeCommandResponse';
import type { DeleteIncomeTypeCommandResponse } from '../models/DeleteIncomeTypeCommandResponse';
import type { GetIncomeTypeDetailQueryResponse } from '../models/GetIncomeTypeDetailQueryResponse';
import type { GetIncomeTypeListQueryResponse } from '../models/GetIncomeTypeListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateIncomeTypeCommand } from '../models/UpdateIncomeTypeCommand';
import type { UpdateIncomeTypeCommandResponse } from '../models/UpdateIncomeTypeCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class IncomeTypeService {
    /**
     * @param version
     * @returns GetIncomeTypeListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVIncomeType(
        version: string,
    ): CancelablePromise<GetIncomeTypeListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/IncomeType',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateIncomeTypeCommandResponse Success
     * @throws ApiError
     */
    public static postApiVIncomeType(
        version: string,
        requestBody?: CreateIncomeTypeCommand,
    ): CancelablePromise<CreateIncomeTypeCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IncomeType',
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
     * @returns UpdateIncomeTypeCommandResponse Success
     * @throws ApiError
     */
    public static putApiVIncomeType(
        version: string,
        requestBody?: UpdateIncomeTypeCommand,
    ): CancelablePromise<UpdateIncomeTypeCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/IncomeType',
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
     * @returns GetIncomeTypeDetailQueryResponse Success
     * @throws ApiError
     */
    public static getIncomeTypeById(
        id: string,
        version: string,
    ): CancelablePromise<GetIncomeTypeDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/IncomeType/{id}',
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
     * @returns DeleteIncomeTypeCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteIncomeType(
        id: string,
        version: string,
    ): CancelablePromise<DeleteIncomeTypeCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/IncomeType/{id}',
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
