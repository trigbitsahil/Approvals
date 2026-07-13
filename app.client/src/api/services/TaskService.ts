/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTaskCommand } from '../models/CreateTaskCommand';
import type { CreateTaskCommandResponse } from '../models/CreateTaskCommandResponse';
import type { GetTaskListQueryResponse } from '../models/GetTaskListQueryResponse';
import type { UpdateTaskCommand } from '../models/UpdateTaskCommand';
import type { UpdateTaskCommandResponse } from '../models/UpdateTaskCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaskService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetTaskListQueryResponse Success
     * @throws ApiError
     */
    public static taskGet(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetTaskListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Task',
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
     * @returns CreateTaskCommandResponse Success
     * @throws ApiError
     */
    public static taskPost(
        version: string,
        requestBody?: CreateTaskCommand,
    ): CancelablePromise<CreateTaskCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Task',
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
     * @returns UpdateTaskCommandResponse Success
     * @throws ApiError
     */
    public static taskPut(
        version: string,
        requestBody?: UpdateTaskCommand,
    ): CancelablePromise<UpdateTaskCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Task',
            path: {
                'version': version,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    public static taskDelete(
        id: string,
        version: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/Task/{id}',
            path: {
                'id': id,
                'version': version,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }
}
