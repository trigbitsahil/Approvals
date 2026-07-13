/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateIncomeCategoryCommand } from '../models/CreateIncomeCategoryCommand';
import type { CreateIncomeCategoryCommandResponse } from '../models/CreateIncomeCategoryCommandResponse';
import type { DeleteIncomeCategoryCommandResponse } from '../models/DeleteIncomeCategoryCommandResponse';
import type { GetIncomeCategoryDetailQueryResponse } from '../models/GetIncomeCategoryDetailQueryResponse';
import type { GetIncomeCategoryListQueryResponse } from '../models/GetIncomeCategoryListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateIncomeCategoryCommand } from '../models/UpdateIncomeCategoryCommand';
import type { UpdateIncomeCategoryCommandResponse } from '../models/UpdateIncomeCategoryCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class IncomeCategoryService {
    /**
     * @param version
     * @returns GetIncomeCategoryListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVIncomeCategory(
        version: string,
    ): CancelablePromise<GetIncomeCategoryListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/IncomeCategory',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateIncomeCategoryCommandResponse Success
     * @throws ApiError
     */
    public static postApiVIncomeCategory(
        version: string,
        requestBody?: CreateIncomeCategoryCommand,
    ): CancelablePromise<CreateIncomeCategoryCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IncomeCategory',
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
     * @returns UpdateIncomeCategoryCommandResponse Success
     * @throws ApiError
     */
    public static putApiVIncomeCategory(
        version: string,
        requestBody?: UpdateIncomeCategoryCommand,
    ): CancelablePromise<UpdateIncomeCategoryCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/IncomeCategory',
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
     * @returns GetIncomeCategoryDetailQueryResponse Success
     * @throws ApiError
     */
    public static getIncomeCategoryById(
        id: string,
        version: string,
    ): CancelablePromise<GetIncomeCategoryDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/IncomeCategory/{id}',
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
     * @returns DeleteIncomeCategoryCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteIncomeCategory(
        id: string,
        version: string,
    ): CancelablePromise<DeleteIncomeCategoryCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/IncomeCategory/{id}',
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
