/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTaskRecurrenceExceptionCommand } from '../models/CreateTaskRecurrenceExceptionCommand';
import type { CreateTaskRecurrenceExceptionCommandResponse } from '../models/CreateTaskRecurrenceExceptionCommandResponse';
import type { DeleteTaskRecurrenceExceptionCommandResponse } from '../models/DeleteTaskRecurrenceExceptionCommandResponse';
import type { GetTaskRecurrenceExceptionDetailQueryResponse } from '../models/GetTaskRecurrenceExceptionDetailQueryResponse';
import type { GetTaskRecurrenceExceptionListQueryResponse } from '../models/GetTaskRecurrenceExceptionListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateTaskRecurrenceExceptionCommand } from '../models/UpdateTaskRecurrenceExceptionCommand';
import type { UpdateTaskRecurrenceExceptionCommandResponse } from '../models/UpdateTaskRecurrenceExceptionCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaskRecurrenceExceptionService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetTaskRecurrenceExceptionListQueryResponse Success
     * @throws ApiError
     */
    public static taskRecurrenceExceptionGet(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetTaskRecurrenceExceptionListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaskRecurrenceException',
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
     * @returns CreateTaskRecurrenceExceptionCommandResponse Success
     * @throws ApiError
     */
    public static taskRecurrenceExceptionPost(
        version: string,
        requestBody?: CreateTaskRecurrenceExceptionCommand,
    ): CancelablePromise<CreateTaskRecurrenceExceptionCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/TaskRecurrenceException',
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
     * @returns UpdateTaskRecurrenceExceptionCommandResponse Success
     * @throws ApiError
     */
    public static taskRecurrenceExceptionPut(
        version: string,
        requestBody?: UpdateTaskRecurrenceExceptionCommand,
    ): CancelablePromise<UpdateTaskRecurrenceExceptionCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/TaskRecurrenceException',
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
     * @returns GetTaskRecurrenceExceptionDetailQueryResponse Success
     * @throws ApiError
     */
    public static getTaskRecurrenceExceptionById(
        id: string,
        version: string,
    ): CancelablePromise<GetTaskRecurrenceExceptionDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaskRecurrenceException/{id}',
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
     * @returns DeleteTaskRecurrenceExceptionCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteTaskRecurrenceException(
        id: string,
        version: string,
    ): CancelablePromise<DeleteTaskRecurrenceExceptionCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/TaskRecurrenceException/{id}',
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
