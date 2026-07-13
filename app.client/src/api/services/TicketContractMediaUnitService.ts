/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTicketContractMediaUnitCommand } from '../models/CreateTicketContractMediaUnitCommand';
import type { CreateTicketContractMediaUnitCommandResponse } from '../models/CreateTicketContractMediaUnitCommandResponse';
import type { DeleteTicketContractMediaUnitCommandResponse } from '../models/DeleteTicketContractMediaUnitCommandResponse';
import type { GetTicketContractMediaUnitDetailQueryResponse } from '../models/GetTicketContractMediaUnitDetailQueryResponse';
import type { GetTicketContractMediaUnitListQueryResponse } from '../models/GetTicketContractMediaUnitListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateTicketContractMediaUnitCommand } from '../models/UpdateTicketContractMediaUnitCommand';
import type { UpdateTicketContractMediaUnitCommandResponse } from '../models/UpdateTicketContractMediaUnitCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TicketContractMediaUnitService {
    static contractName: string;

    /**
     * Get all TicketContractMediaUnit mappings
     * @param version
     * @returns GetTicketContractMediaUnitListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVTicketContractMediaUnit(
        version: string,
    ): CancelablePromise<GetTicketContractMediaUnitListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TicketContractMediaUnit',
            path: {
                'version': version,
            },
        });
    }

    /**
     * Get TicketContractMediaUnit by ticketId using query parameter
     * @param ticketId The ticket ID to filter by (e.g., Tckt_...)
     * @param version API version
     * @returns GetTicketContractMediaUnitListQueryResponse Success
     * @throws ApiError
     */
    public static getByTicketIdQuery(
        ticketId: string,
        version: string,
    ): CancelablePromise<GetTicketContractMediaUnitListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TicketContractMediaUnit',
            path: {
                'version': version,
            },
            query: {
                ticketId: ticketId,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @param version
     * @param requestBody
     * @returns CreateTicketContractMediaUnitCommandResponse Success
     * @throws ApiError
     */
    public static postApiVTicketContractMediaUnit(
        version: string,
        requestBody?: CreateTicketContractMediaUnitCommand,
    ): CancelablePromise<CreateTicketContractMediaUnitCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/TicketContractMediaUnit',
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
     * @returns UpdateTicketContractMediaUnitCommandResponse Success
     * @throws ApiError
     */
    public static putApiVTicketContractMediaUnit(
        version: string,
        requestBody?: UpdateTicketContractMediaUnitCommand,
    ): CancelablePromise<UpdateTicketContractMediaUnitCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/TicketContractMediaUnit',
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
     * @returns GetTicketContractMediaUnitDetailQueryResponse Success
     * @throws ApiError
     */
    public static getTicketContractMediaUnitById(
        id: string,
        version: string,
    ): CancelablePromise<GetTicketContractMediaUnitDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TicketContractMediaUnit/{id}',
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
     * @returns DeleteTicketContractMediaUnitCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteTicketContractMediaUnit(
        id: string,
        version: string,
    ): CancelablePromise<DeleteTicketContractMediaUnitCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/TicketContractMediaUnit/{id}',
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