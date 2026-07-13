/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateBudgetTypeCommand } from '../models/CreateBudgetTypeCommand';
import type { CreateBudgetTypeCommandResponse } from '../models/CreateBudgetTypeCommandResponse';
import type { DeleteBudgetTypeCommandResponse } from '../models/DeleteBudgetTypeCommandResponse';
import type { GetBudgetTypeDetailQueryResponse } from '../models/GetBudgetTypeDetailQueryResponse';
import type { GetBudgetTypeListQueryResponse } from '../models/GetBudgetTypeListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateBudgetTypeCommand } from '../models/UpdateBudgetTypeCommand';
import type { UpdateBudgetTypeCommandResponse } from '../models/UpdateBudgetTypeCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BudgetTypeService {
    /**
     * @param version
     * @returns GetBudgetTypeListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVBudgetType(
        version: string,
    ): CancelablePromise<GetBudgetTypeListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/BudgetType',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateBudgetTypeCommandResponse Success
     * @throws ApiError
     */
    public static postApiVBudgetType(
        version: string,
        requestBody?: CreateBudgetTypeCommand,
    ): CancelablePromise<CreateBudgetTypeCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/BudgetType',
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
     * @returns UpdateBudgetTypeCommandResponse Success
     * @throws ApiError
     */
    public static putApiVBudgetType(
        version: string,
        requestBody?: UpdateBudgetTypeCommand,
    ): CancelablePromise<UpdateBudgetTypeCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/BudgetType',
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
     * @returns GetBudgetTypeDetailQueryResponse Success
     * @throws ApiError
     */
    public static getBudgetTypeById(
        id: string,
        version: string,
    ): CancelablePromise<GetBudgetTypeDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/BudgetType/{id}',
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
     * @returns DeleteBudgetTypeCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteBudgetType(
        id: string,
        version: string,
    ): CancelablePromise<DeleteBudgetTypeCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/BudgetType/{id}',
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
