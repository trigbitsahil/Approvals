/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRecurrenceExceptionCommand } from '../models/CreateRecurrenceExceptionCommand';
import type { CreateRecurrenceExceptionCommandResponse } from '../models/CreateRecurrenceExceptionCommandResponse';
import type { DeleteRecurrenceExceptionCommandResponse } from '../models/DeleteRecurrenceExceptionCommandResponse';
import type { GetRecurrenceExceptionDetailQueryResponse } from '../models/GetRecurrenceExceptionDetailQueryResponse';
import type { GetRecurrenceExceptionListQueryResponse } from '../models/GetRecurrenceExceptionListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateRecurrenceExceptionCommand } from '../models/UpdateRecurrenceExceptionCommand';
import type { UpdateRecurrenceExceptionCommandResponse } from '../models/UpdateRecurrenceExceptionCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RecurrenceExceptionService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetRecurrenceExceptionListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVRecurrenceException(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetRecurrenceExceptionListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RecurrenceException',
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
     * @returns CreateRecurrenceExceptionCommandResponse Success
     * @throws ApiError
     */
    public static postApiVRecurrenceException(
        version: string,
        requestBody?: CreateRecurrenceExceptionCommand,
    ): CancelablePromise<CreateRecurrenceExceptionCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/RecurrenceException',
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
     * @returns UpdateRecurrenceExceptionCommandResponse Success
     * @throws ApiError
     */
    public static putApiVRecurrenceException(
        version: string,
        requestBody?: UpdateRecurrenceExceptionCommand,
    ): CancelablePromise<UpdateRecurrenceExceptionCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/RecurrenceException',
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
     * @returns GetRecurrenceExceptionDetailQueryResponse Success
     * @throws ApiError
     */
    public static getRecurrenceExceptionById(
        id: string,
        version: string,
    ): CancelablePromise<GetRecurrenceExceptionDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RecurrenceException/{id}',
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
     * @returns DeleteRecurrenceExceptionCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteRecurrenceException(
        id: string,
        version: string,
    ): CancelablePromise<DeleteRecurrenceExceptionCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/RecurrenceException/{id}',
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
