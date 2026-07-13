/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateEventUserCommand } from '../models/CreateEventUserCommand';
import type { CreateEventUserCommandResponse } from '../models/CreateEventUserCommandResponse';
import type { DeleteEventUserCommandResponse } from '../models/DeleteEventUserCommandResponse';
import type { GetEventUserDetailQueryResponse } from '../models/GetEventUserDetailQueryResponse';
import type { GetEventUserListQueryResponse } from '../models/GetEventUserListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateEventUserCommand } from '../models/UpdateEventUserCommand';
import type { UpdateEventUserCommandResponse } from '../models/UpdateEventUserCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EventUserService {
    /**
     * @param version
     * @returns GetEventUserListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVEventUser(
        version: string,
    ): CancelablePromise<GetEventUserListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EventUser',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateEventUserCommandResponse Success
     * @throws ApiError
     */
    public static postApiVEventUser(
        version: string,
        requestBody?: CreateEventUserCommand,
    ): CancelablePromise<CreateEventUserCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/EventUser',
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
     * @returns UpdateEventUserCommandResponse Success
     * @throws ApiError
     */
    public static putApiVEventUser(
        version: string,
        requestBody?: UpdateEventUserCommand,
    ): CancelablePromise<UpdateEventUserCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/EventUser',
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
     * @returns GetEventUserDetailQueryResponse Success
     * @throws ApiError
     */
    public static getEventUserById(
        id: string,
        version: string,
    ): CancelablePromise<GetEventUserDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EventUser/{id}',
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
     * @returns DeleteEventUserCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteEventUser(
        id: string,
        version: string,
    ): CancelablePromise<DeleteEventUserCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/EventUser/{id}',
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
