/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTaskPriorityCommand } from '../models/CreateTaskPriorityCommand';
import type { CreateTaskPriorityCommandResponse } from '../models/CreateTaskPriorityCommandResponse';
import type { DeleteTaskPriorityCommandResponse } from '../models/DeleteTaskPriorityCommandResponse';
import type { GetTaskPriorityDetailQueryResponse } from '../models/GetTaskPriorityDetailQueryResponse';
import type { GetTaskPriorityListQueryResponse } from '../models/GetTaskPriorityListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateTaskPriorityCommand } from '../models/UpdateTaskPriorityCommand';
import type { UpdateTaskPriorityCommandResponse } from '../models/UpdateTaskPriorityCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaskPriorityService {
    /**
     * @param version
     * @returns GetTaskPriorityListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVTaskPriority(
        version: string,
    ): CancelablePromise<GetTaskPriorityListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaskPriority',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateTaskPriorityCommandResponse Success
     * @throws ApiError
     */
    public static postApiVTaskPriority(
        version: string,
        requestBody?: CreateTaskPriorityCommand,
    ): CancelablePromise<CreateTaskPriorityCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/TaskPriority',
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
     * @returns UpdateTaskPriorityCommandResponse Success
     * @throws ApiError
     */
    public static putApiVTaskPriority(
        version: string,
        requestBody?: UpdateTaskPriorityCommand,
    ): CancelablePromise<UpdateTaskPriorityCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/TaskPriority',
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
     * @returns GetTaskPriorityDetailQueryResponse Success
     * @throws ApiError
     */
    public static getTaskPriorityById(
        id: string,
        version: string,
    ): CancelablePromise<GetTaskPriorityDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaskPriority/{id}',
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
     * @returns DeleteTaskPriorityCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteTaskPriority(
        id: string,
        version: string,
    ): CancelablePromise<DeleteTaskPriorityCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/TaskPriority/{id}',
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
