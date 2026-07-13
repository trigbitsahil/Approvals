/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRecurrenceRuleCommand } from '../models/CreateRecurrenceRuleCommand';
import type { CreateRecurrenceRuleCommandResponse } from '../models/CreateRecurrenceRuleCommandResponse';
import type { DeleteRecurrenceRuleCommandResponse } from '../models/DeleteRecurrenceRuleCommandResponse';
import type { GetRecurrenceRuleDetailQueryResponse } from '../models/GetRecurrenceRuleDetailQueryResponse';
import type { GetRecurrenceRuleListQueryResponse } from '../models/GetRecurrenceRuleListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateRecurrenceRuleCommand } from '../models/UpdateRecurrenceRuleCommand';
import type { UpdateRecurrenceRuleCommandResponse } from '../models/UpdateRecurrenceRuleCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RecurrenceRuleService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetRecurrenceRuleListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVRecurrenceRule(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetRecurrenceRuleListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RecurrenceRule',
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
     * @returns CreateRecurrenceRuleCommandResponse Success
     * @throws ApiError
     */
    public static postApiVRecurrenceRule(
        version: string,
        requestBody?: CreateRecurrenceRuleCommand,
    ): CancelablePromise<CreateRecurrenceRuleCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/RecurrenceRule',
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
     * @returns UpdateRecurrenceRuleCommandResponse Success
     * @throws ApiError
     */
    public static putApiVRecurrenceRule(
        version: string,
        requestBody?: UpdateRecurrenceRuleCommand,
    ): CancelablePromise<UpdateRecurrenceRuleCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/RecurrenceRule',
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
     * @returns GetRecurrenceRuleDetailQueryResponse Success
     * @throws ApiError
     */
    public static getRecurrenceRuleById(
        id: string,
        version: string,
    ): CancelablePromise<GetRecurrenceRuleDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RecurrenceRule/{id}',
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
     * @returns DeleteRecurrenceRuleCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteRecurrenceRule(
        id: string,
        version: string,
    ): CancelablePromise<DeleteRecurrenceRuleCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/RecurrenceRule/{id}',
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
