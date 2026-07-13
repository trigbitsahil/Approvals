/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTaskTypeCommand } from '../models/CreateTaskTypeCommand';
import type { CreateTaskTypeCommandResponse } from '../models/CreateTaskTypeCommandResponse';
import type { DeleteTaskTypeCommandResponse } from '../models/DeleteTaskTypeCommandResponse';
import type { GetTaskTypeDetailQueryResponse } from '../models/GetTaskTypeDetailQueryResponse';
import type { GetTaskTypeListQueryResponse } from '../models/GetTaskTypeListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateTaskTypeCommand } from '../models/UpdateTaskTypeCommand';
import type { UpdateTaskTypeCommandResponse } from '../models/UpdateTaskTypeCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaskTypeService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetTaskTypeListQueryResponse Success
     * @throws ApiError
     */
    public static taskTypeGet(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetTaskTypeListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaskType',
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
     * @returns CreateTaskTypeCommandResponse Success
     * @throws ApiError
     */
    public static taskTypePost(
        version: string,
        requestBody?: CreateTaskTypeCommand,
    ): CancelablePromise<CreateTaskTypeCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/TaskType',
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
     * @returns UpdateTaskTypeCommandResponse Success
     * @throws ApiError
     */
    public static taskTypePut(
        version: string,
        requestBody?: UpdateTaskTypeCommand,
    ): CancelablePromise<UpdateTaskTypeCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/TaskType',
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
     * @returns GetTaskTypeDetailQueryResponse Success
     * @throws ApiError
     */
    public static getTaskTypeById(
        id: string,
        version: string,
    ): CancelablePromise<GetTaskTypeDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaskType/{id}',
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
     * @returns DeleteTaskTypeCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteTaskType(
        id: string,
        version: string,
    ): CancelablePromise<DeleteTaskTypeCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/TaskType/{id}',
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
