/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserIntermediateCommand } from '../models/CreateUserIntermediateCommand';
import type { CreateUserIntermediateCommandResponse } from '../models/CreateUserIntermediateCommandResponse';
import type { DeleteUserIntermediateCommandResponse } from '../models/DeleteUserIntermediateCommandResponse';
import type { GetUserIntermediateDetailQueryResponse } from '../models/GetUserIntermediateDetailQueryResponse';
import type { GetUserIntermediateListQueryResponse } from '../models/GetUserIntermediateListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateUserIntermediateCommand } from '../models/UpdateUserIntermediateCommand';
import type { UpdateUserIntermediateCommandResponse } from '../models/UpdateUserIntermediateCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserIntermediateService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetUserIntermediateListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVUserIntermediate(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetUserIntermediateListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/UserIntermediate',
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
     * @returns CreateUserIntermediateCommandResponse Success
     * @throws ApiError
     */
    public static postApiVUserIntermediate(
        version: string,
        requestBody?: CreateUserIntermediateCommand,
    ): CancelablePromise<CreateUserIntermediateCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/UserIntermediate',
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
     * @returns UpdateUserIntermediateCommandResponse Success
     * @throws ApiError
     */
    public static putApiVUserIntermediate(
        version: string,
        requestBody?: UpdateUserIntermediateCommand,
    ): CancelablePromise<UpdateUserIntermediateCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/UserIntermediate',
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
     * @returns GetUserIntermediateDetailQueryResponse Success
     * @throws ApiError
     */
    public static getUserIntermediateById(
        id: string,
        version: string,
    ): CancelablePromise<GetUserIntermediateDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/UserIntermediate/{id}',
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
     * @returns DeleteUserIntermediateCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteUserIntermediate(
        id: string,
        version: string,
    ): CancelablePromise<DeleteUserIntermediateCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/UserIntermediate/{id}',
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
