/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTaskStatusCommand } from '../models/CreateTaskStatusCommand';
import type { CreateTaskStatusCommandResponse } from '../models/CreateTaskStatusCommandResponse';
import type { DeleteTaskStatusCommandResponse } from '../models/DeleteTaskStatusCommandResponse';
import type { GetTaskStatusDetailQueryResponse } from '../models/GetTaskStatusDetailQueryResponse';
import type { GetTaskStatusListQueryResponse } from '../models/GetTaskStatusListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateTaskStatusCommand } from '../models/UpdateTaskStatusCommand';
import type { UpdateTaskStatusCommandResponse } from '../models/UpdateTaskStatusCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaskStatusService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetTaskStatusListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVTaskStatus(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetTaskStatusListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaskStatus',
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
     * @returns CreateTaskStatusCommandResponse Success
     * @throws ApiError
     */
    public static postApiVTaskStatus(
        version: string,
        requestBody?: CreateTaskStatusCommand,
    ): CancelablePromise<CreateTaskStatusCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/TaskStatus',
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
     * @returns UpdateTaskStatusCommandResponse Success
     * @throws ApiError
     */
    public static putApiVTaskStatus(
        version: string,
        requestBody?: UpdateTaskStatusCommand,
    ): CancelablePromise<UpdateTaskStatusCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/TaskStatus',
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
     * @returns GetTaskStatusDetailQueryResponse Success
     * @throws ApiError
     */
    public static getTaskStatusById(
        id: string,
        version: string,
    ): CancelablePromise<GetTaskStatusDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaskStatus/{id}',
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
     * @returns DeleteTaskStatusCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteTaskStatus(
        id: string,
        version: string,
    ): CancelablePromise<DeleteTaskStatusCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/TaskStatus/{id}',
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
