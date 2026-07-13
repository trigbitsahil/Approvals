/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateEventTypeCommand } from '../models/CreateEventTypeCommand';
import type { CreateEventTypeCommandResponse } from '../models/CreateEventTypeCommandResponse';
import type { DeleteEventTypeCommandResponse } from '../models/DeleteEventTypeCommandResponse';
import type { GetEventTypeDetailQueryResponse } from '../models/GetEventTypeDetailQueryResponse';
import type { GetEventTypeListQueryResponse } from '../models/GetEventTypeListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateEventTypeCommand } from '../models/UpdateEventTypeCommand';
import type { UpdateEventTypeCommandResponse } from '../models/UpdateEventTypeCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EventTypeService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetEventTypeListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVEventType(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetEventTypeListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EventType',
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
     * @returns CreateEventTypeCommandResponse Success
     * @throws ApiError
     */
    public static postApiVEventType(
        version: string,
        requestBody?: CreateEventTypeCommand,
    ): CancelablePromise<CreateEventTypeCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/EventType',
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
     * @returns UpdateEventTypeCommandResponse Success
     * @throws ApiError
     */
    public static putApiVEventType(
        version: string,
        requestBody?: UpdateEventTypeCommand,
    ): CancelablePromise<UpdateEventTypeCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/EventType',
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
     * @returns GetEventTypeDetailQueryResponse Success
     * @throws ApiError
     */
    public static getEventTypeById(
        id: string,
        version: string,
    ): CancelablePromise<GetEventTypeDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EventType/{id}',
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
     * @returns DeleteEventTypeCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteEventType(
        id: string,
        version: string,
    ): CancelablePromise<DeleteEventTypeCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/EventType/{id}',
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
