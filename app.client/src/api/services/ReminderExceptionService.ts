/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateReminderExceptionCommand } from '../models/CreateReminderExceptionCommand';
import type { CreateReminderExceptionCommandResponse } from '../models/CreateReminderExceptionCommandResponse';
import type { DeleteReminderExceptionCommandResponse } from '../models/DeleteReminderExceptionCommandResponse';
import type { GetReminderExceptionDetailQueryResponse } from '../models/GetReminderExceptionDetailQueryResponse';
import type { GetReminderExceptionListQueryResponse } from '../models/GetReminderExceptionListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateReminderExceptionCommand } from '../models/UpdateReminderExceptionCommand';
import type { UpdateReminderExceptionCommandResponse } from '../models/UpdateReminderExceptionCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReminderExceptionService {
    /**
     * @param version
     * @returns GetReminderExceptionListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVReminderException(
        version: string,
    ): CancelablePromise<GetReminderExceptionListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ReminderException',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateReminderExceptionCommandResponse Success
     * @throws ApiError
     */
    public static postApiVReminderException(
        version: string,
        requestBody?: CreateReminderExceptionCommand,
    ): CancelablePromise<CreateReminderExceptionCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ReminderException',
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
     * @returns UpdateReminderExceptionCommandResponse Success
     * @throws ApiError
     */
    public static putApiVReminderException(
        version: string,
        requestBody?: UpdateReminderExceptionCommand,
    ): CancelablePromise<UpdateReminderExceptionCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ReminderException',
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
     * @returns GetReminderExceptionDetailQueryResponse Success
     * @throws ApiError
     */
    public static getReminderExceptionById(
        id: string,
        version: string,
    ): CancelablePromise<GetReminderExceptionDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ReminderException/{id}',
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
     * @returns DeleteReminderExceptionCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteReminderException(
        id: string,
        version: string,
    ): CancelablePromise<DeleteReminderExceptionCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ReminderException/{id}',
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
