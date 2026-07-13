/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTicketTypeCommand } from '../models/CreateTicketTypeCommand';
import type { CreateTicketTypeCommandResponse } from '../models/CreateTicketTypeCommandResponse';
import type { DeleteTicketTypeCommandResponse } from '../models/DeleteTicketTypeCommandResponse';
import type { GetTicketTypeDetailQueryResponse } from '../models/GetTicketTypeDetailQueryResponse';
import type { GetTicketTypeListQueryResponse } from '../models/GetTicketTypeListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateTicketTypeCommand } from '../models/UpdateTicketTypeCommand';
import type { UpdateTicketTypeCommandResponse } from '../models/UpdateTicketTypeCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TicketTypeService {
    /**
     * FIXED: Now correctly sends departmentId as QUERY parameter
     * @param version
     * @param departmentId Optional department filter
     * @returns GetTicketTypeListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVTicketType(
        version: string,
        departmentId?: string | null,
    ): CancelablePromise<GetTicketTypeListQueryResponse> {
        const queryParams: Record<string, any> = {};
        if (departmentId) {
            queryParams.departmentId = departmentId;
        }

        return __request(OpenAPI, {
            method: 'GET',
            url: `/api/v${version}/TicketType`,
            query: queryParams, // This is the fix!
        });
    }

    // Rest of the methods stay 100% the same
    public static postApiVTicketType(
        version: string,
        requestBody?: CreateTicketTypeCommand,
    ): CancelablePromise<CreateTicketTypeCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: `/api/v${version}/TicketType`,
            body: requestBody,
            mediaType: 'application/json',
            errors: { 400: `Bad Request` },
        });
    }

    public static putApiVTicketType(
        version: string,
        requestBody?: UpdateTicketTypeCommand,
    ): CancelablePromise<UpdateTicketTypeCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: `/api/v${version}/TicketType`,
            body: requestBody,
            mediaType: 'application/json',
            errors: { 400: `Bad Request` },
        });
    }

    public static getTicketTypeById(
        id: string,
        version: string,
    ): CancelablePromise<GetTicketTypeDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: `/api/v${version}/TicketType/${id}`,
            errors: { 404: `Not Found` },
        });
    }

    public static deleteTicketType(
        id: string,
        version: string,
    ): CancelablePromise<DeleteTicketTypeCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: `/api/v${version}/TicketType/${id}`,
            errors: { 400: `Bad Request` },
        });
    }
}