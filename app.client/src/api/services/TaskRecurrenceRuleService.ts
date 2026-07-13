/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTaskRecurrenceRuleCommand } from '../models/CreateTaskRecurrenceRuleCommand';
import type { CreateTaskRecurrenceRuleCommandResponse } from '../models/CreateTaskRecurrenceRuleCommandResponse';
import type { DeleteTaskRecurrenceRuleCommandResponse } from '../models/DeleteTaskRecurrenceRuleCommandResponse';
import type { GetTaskRecurrenceRuleDetailQueryResponse } from '../models/GetTaskRecurrenceRuleDetailQueryResponse';
import type { GetTaskRecurrenceRuleListQueryResponse } from '../models/GetTaskRecurrenceRuleListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateTaskRecurrenceRuleCommand } from '../models/UpdateTaskRecurrenceRuleCommand';
import type { UpdateTaskRecurrenceRuleCommandResponse } from '../models/UpdateTaskRecurrenceRuleCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaskRecurrenceRuleService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetTaskRecurrenceRuleListQueryResponse Success
     * @throws ApiError
     */
    public static taskRecurrenceRuleGet(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetTaskRecurrenceRuleListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaskRecurrenceRule',
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
     * @returns CreateTaskRecurrenceRuleCommandResponse Success
     * @throws ApiError
     */
    public static taskRecurrenceRulePost(
        version: string,
        requestBody?: CreateTaskRecurrenceRuleCommand,
    ): CancelablePromise<CreateTaskRecurrenceRuleCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/TaskRecurrenceRule',
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
     * @returns UpdateTaskRecurrenceRuleCommandResponse Success
     * @throws ApiError
     */
    public static taskRecurrenceRulePut(
        version: string,
        requestBody?: UpdateTaskRecurrenceRuleCommand,
    ): CancelablePromise<UpdateTaskRecurrenceRuleCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/TaskRecurrenceRule',
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
     * @returns GetTaskRecurrenceRuleDetailQueryResponse Success
     * @throws ApiError
     */
    public static getTaskRecurrenceRuleById(
        id: string,
        version: string,
    ): CancelablePromise<GetTaskRecurrenceRuleDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaskRecurrenceRule/{id}',
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
     * @returns DeleteTaskRecurrenceRuleCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteTaskRecurrenceRule(
        id: string,
        version: string,
    ): CancelablePromise<DeleteTaskRecurrenceRuleCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/TaskRecurrenceRule/{id}',
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
