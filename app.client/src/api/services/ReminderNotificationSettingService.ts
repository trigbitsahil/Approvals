/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateReminderNotificationSettingCommand } from '../models/CreateReminderNotificationSettingCommand';
import type { CreateReminderNotificationSettingCommandResponse } from '../models/CreateReminderNotificationSettingCommandResponse';
import type { DeleteReminderNotificationSettingCommandResponse } from '../models/DeleteReminderNotificationSettingCommandResponse';
import type { GetReminderNotificationSettingDetailQueryResponse } from '../models/GetReminderNotificationSettingDetailQueryResponse';
import type { GetReminderNotificationSettingListQueryResponse } from '../models/GetReminderNotificationSettingListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateReminderNotificationSettingCommand } from '../models/UpdateReminderNotificationSettingCommand';
import type { UpdateReminderNotificationSettingCommandResponse } from '../models/UpdateReminderNotificationSettingCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReminderNotificationSettingService {
    /**
     * @param version
     * @returns GetReminderNotificationSettingListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVReminderNotificationSetting(
        version: string,
    ): CancelablePromise<GetReminderNotificationSettingListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ReminderNotificationSetting',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateReminderNotificationSettingCommandResponse Success
     * @throws ApiError
     */
    public static postApiVReminderNotificationSetting(
        version: string,
        requestBody?: CreateReminderNotificationSettingCommand,
    ): CancelablePromise<CreateReminderNotificationSettingCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ReminderNotificationSetting',
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
     * @returns UpdateReminderNotificationSettingCommandResponse Success
     * @throws ApiError
     */
    public static putApiVReminderNotificationSetting(
        version: string,
        requestBody?: UpdateReminderNotificationSettingCommand,
    ): CancelablePromise<UpdateReminderNotificationSettingCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ReminderNotificationSetting',
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
     * @returns GetReminderNotificationSettingDetailQueryResponse Success
     * @throws ApiError
     */
    public static getReminderNotificationSettingById(
        id: string,
        version: string,
    ): CancelablePromise<GetReminderNotificationSettingDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ReminderNotificationSetting/{id}',
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
     * @returns DeleteReminderNotificationSettingCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteReminderNotificationSetting(
        id: string,
        version: string,
    ): CancelablePromise<DeleteReminderNotificationSettingCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ReminderNotificationSetting/{id}',
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
