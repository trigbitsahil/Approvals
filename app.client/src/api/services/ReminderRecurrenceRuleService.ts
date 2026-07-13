/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateReminderRecurrenceRuleCommand } from '../models/CreateReminderRecurrenceRuleCommand';
import type { CreateReminderRecurrenceRuleCommandResponse } from '../models/CreateReminderRecurrenceRuleCommandResponse';
import type { DeleteReminderRecurrenceRuleCommandResponse } from '../models/DeleteReminderRecurrenceRuleCommandResponse';
import type { GetReminderRecurrenceRuleDetailQueryResponse } from '../models/GetReminderRecurrenceRuleDetailQueryResponse';
import type { GetReminderRecurrenceRuleListQueryResponse } from '../models/GetReminderRecurrenceRuleListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateReminderRecurrenceRuleCommand } from '../models/UpdateReminderRecurrenceRuleCommand';
import type { UpdateReminderRecurrenceRuleCommandResponse } from '../models/UpdateReminderRecurrenceRuleCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReminderRecurrenceRuleService {
    /**
     * @param version
     * @returns GetReminderRecurrenceRuleListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVReminderRecurrenceRule(
        version: string,
    ): CancelablePromise<GetReminderRecurrenceRuleListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ReminderRecurrenceRule',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateReminderRecurrenceRuleCommandResponse Success
     * @throws ApiError
     */
    public static postApiVReminderRecurrenceRule(
        version: string,
        requestBody?: CreateReminderRecurrenceRuleCommand,
    ): CancelablePromise<CreateReminderRecurrenceRuleCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ReminderRecurrenceRule',
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
     * @returns UpdateReminderRecurrenceRuleCommandResponse Success
     * @throws ApiError
     */
    public static putApiVReminderRecurrenceRule(
        version: string,
        requestBody?: UpdateReminderRecurrenceRuleCommand,
    ): CancelablePromise<UpdateReminderRecurrenceRuleCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ReminderRecurrenceRule',
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
     * @returns GetReminderRecurrenceRuleDetailQueryResponse Success
     * @throws ApiError
     */
    public static getReminderRecurrenceRuleById(
        id: string,
        version: string,
    ): CancelablePromise<GetReminderRecurrenceRuleDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ReminderRecurrenceRule/{id}',
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
     * @returns DeleteReminderRecurrenceRuleCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteReminderRecurrenceRule(
        id: string,
        version: string,
    ): CancelablePromise<DeleteReminderRecurrenceRuleCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ReminderRecurrenceRule/{id}',
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
