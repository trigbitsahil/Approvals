/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTicketStatusCommand } from '../models/CreateTicketStatusCommand';
import type { CreateTicketStatusCommandResponse } from '../models/CreateTicketStatusCommandResponse';
import type { DeleteTicketStatusCommandResponse } from '../models/DeleteTicketStatusCommandResponse';
import type { GetTicketStatusDetailQueryResponse } from '../models/GetTicketStatusDetailQueryResponse';
import type { GetTicketStatusListQueryResponse } from '../models/GetTicketStatusListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateTicketStatusCommand } from '../models/UpdateTicketStatusCommand';
import type { UpdateTicketStatusCommandResponse } from '../models/UpdateTicketStatusCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TicketStatusService {
    /**
     * @param version
     * @returns GetTicketStatusListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVTicketStatus(
        version: string,
    ): CancelablePromise<GetTicketStatusListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TicketStatus',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateTicketStatusCommandResponse Success
     * @throws ApiError
     */
    public static postApiVTicketStatus(
        version: string,
        requestBody?: CreateTicketStatusCommand,
    ): CancelablePromise<CreateTicketStatusCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/TicketStatus',
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
     * @returns UpdateTicketStatusCommandResponse Success
     * @throws ApiError
     */
    public static putApiVTicketStatus(
        version: string,
        requestBody?: UpdateTicketStatusCommand,
    ): CancelablePromise<UpdateTicketStatusCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/TicketStatus',
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
     * @returns GetTicketStatusDetailQueryResponse Success
     * @throws ApiError
     */
    public static getTicketStatusById(
        id: string,
        version: string,
    ): CancelablePromise<GetTicketStatusDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TicketStatus/{id}',
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
     * @returns DeleteTicketStatusCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteTicketStatus(
        id: string,
        version: string,
    ): CancelablePromise<DeleteTicketStatusCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/TicketStatus/{id}',
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
