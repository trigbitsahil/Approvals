/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateEventCommand } from '../models/CreateEventCommand';
import type { CreateEventCommandResponse } from '../models/CreateEventCommandResponse';
import type { DeleteEventCommandResponse } from '../models/DeleteEventCommandResponse';
import type { GetEventDetailQueryResponse } from '../models/GetEventDetailQueryResponse';
import type { GetEventListQueryResponse } from '../models/GetEventListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateEventCommand } from '../models/UpdateEventCommand';
import type { UpdateEventCommandResponse } from '../models/UpdateEventCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EventService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetEventListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVEvent(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetEventListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Event',
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
     * @returns CreateEventCommandResponse Success
     * @throws ApiError
     */
    public static postApiVEvent(
        version: string,
        requestBody?: CreateEventCommand,
    ): CancelablePromise<CreateEventCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Event',
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
     * @returns UpdateEventCommandResponse Success
     * @throws ApiError
     */
    public static putApiVEvent(
        version: string,
        requestBody?: UpdateEventCommand,
    ): CancelablePromise<UpdateEventCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Event',
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
     * @returns GetEventDetailQueryResponse Success
     * @throws ApiError
     */
    public static getEventById(
        id: string,
        version: string,
    ): CancelablePromise<GetEventDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Event/{id}',
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
     * @returns DeleteEventCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteEvent(
        id: string,
        version: string,
    ): CancelablePromise<DeleteEventCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/Event/{id}',
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
