/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTicketPriorityCommand } from '../models/CreateTicketPriorityCommand';
import type { CreateTicketPriorityCommandResponse } from '../models/CreateTicketPriorityCommandResponse';
import type { DeleteTicketPriorityCommandResponse } from '../models/DeleteTicketPriorityCommandResponse';
import type { GetTicketPriorityDetailQueryResponse } from '../models/GetTicketPriorityDetailQueryResponse';
import type { GetTicketPriorityListQueryResponse } from '../models/GetTicketPriorityListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateTicketPriorityCommand } from '../models/UpdateTicketPriorityCommand';
import type { UpdateTicketPriorityCommandResponse } from '../models/UpdateTicketPriorityCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TicketPriorityService {
    /**
     * @param version
     * @returns GetTicketPriorityListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVTicketPriority(
        version: string,
    ): CancelablePromise<GetTicketPriorityListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TicketPriority',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateTicketPriorityCommandResponse Success
     * @throws ApiError
     */
    public static postApiVTicketPriority(
        version: string,
        requestBody?: CreateTicketPriorityCommand,
    ): CancelablePromise<CreateTicketPriorityCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/TicketPriority',
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
     * @returns UpdateTicketPriorityCommandResponse Success
     * @throws ApiError
     */
    public static putApiVTicketPriority(
        version: string,
        requestBody?: UpdateTicketPriorityCommand,
    ): CancelablePromise<UpdateTicketPriorityCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/TicketPriority',
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
     * @returns GetTicketPriorityDetailQueryResponse Success
     * @throws ApiError
     */
    public static getTicketPriorityById(
        id: string,
        version: string,
    ): CancelablePromise<GetTicketPriorityDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TicketPriority/{id}',
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
     * @returns DeleteTicketPriorityCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteTicketPriority(
        id: string,
        version: string,
    ): CancelablePromise<DeleteTicketPriorityCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/TicketPriority/{id}',
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
