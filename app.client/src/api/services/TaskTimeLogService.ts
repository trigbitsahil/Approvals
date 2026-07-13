/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTaskTimeLogCommand } from '../models/CreateTaskTimeLogCommand';
import type { CreateTaskTimeLogCommandResponse } from '../models/CreateTaskTimeLogCommandResponse';
import type { DeleteTaskTimeLogCommandResponse } from '../models/DeleteTaskTimeLogCommandResponse';
import type { GetTaskTimeLogDetailQueryResponse } from '../models/GetTaskTimeLogDetailQueryResponse';
import type { GetTaskTimeLogListQueryResponse } from '../models/GetTaskTimeLogListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateTaskTimeLogCommand } from '../models/UpdateTaskTimeLogCommand';
import type { UpdateTaskTimeLogCommandResponse } from '../models/UpdateTaskTimeLogCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaskTimeLogService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetTaskTimeLogListQueryResponse Success
     * @throws ApiError
     */
    public static taskTimeLogGet(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetTaskTimeLogListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaskTimeLog',
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
     * @returns CreateTaskTimeLogCommandResponse Success
     * @throws ApiError
     */
    public static taskTimeLogPost(
        version: string,
        requestBody?: CreateTaskTimeLogCommand,
    ): CancelablePromise<CreateTaskTimeLogCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/TaskTimeLog',
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
     * @returns UpdateTaskTimeLogCommandResponse Success
     * @throws ApiError
     */
    public static taskTimeLogPut(
        version: string,
        requestBody?: UpdateTaskTimeLogCommand,
    ): CancelablePromise<UpdateTaskTimeLogCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/TaskTimeLog',
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
     * @returns GetTaskTimeLogDetailQueryResponse Success
     * @throws ApiError
     */
    public static getTaskTimeLogById(
        id: string,
        version: string,
    ): CancelablePromise<GetTaskTimeLogDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaskTimeLog/{id}',
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
     * @returns DeleteTaskTimeLogCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteTaskTimeLog(
        id: string,
        version: string,
    ): CancelablePromise<DeleteTaskTimeLogCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/TaskTimeLog/{id}',
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
