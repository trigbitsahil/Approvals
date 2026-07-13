/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateReminderCommand } from '../models/CreateReminderCommand';
import type { CreateReminderCommandResponse } from '../models/CreateReminderCommandResponse';
import type { DeleteReminderCommandResponse } from '../models/DeleteReminderCommandResponse';
import type { GetReminderDetailQueryResponse } from '../models/GetReminderDetailQueryResponse';
import type { GetReminderListQueryResponse } from '../models/GetReminderListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateReminderCommand } from '../models/UpdateReminderCommand';
import type { UpdateReminderCommandResponse } from '../models/UpdateReminderCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReminderService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetReminderListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVReminder(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetReminderListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Reminder',
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
     * @returns CreateReminderCommandResponse Success
     * @throws ApiError
     */
    public static postApiVReminder(
        version: string,
        requestBody?: CreateReminderCommand,
    ): CancelablePromise<CreateReminderCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Reminder',
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
     * @returns UpdateReminderCommandResponse Success
     * @throws ApiError
     */
    public static putApiVReminder(
        version: string,
        requestBody?: UpdateReminderCommand,
    ): CancelablePromise<UpdateReminderCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Reminder',
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
     * @returns GetReminderDetailQueryResponse Success
     * @throws ApiError
     */
    public static getReminderById(
        id: string,
        version: string,
    ): CancelablePromise<GetReminderDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Reminder/{id}',
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
     * @returns DeleteReminderCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteReminder(
        id: string,
        version: string,
    ): CancelablePromise<DeleteReminderCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/Reminder/{id}',
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
