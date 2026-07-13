/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTicketCommentCommand } from '../models/CreateTicketCommentCommand';
import type { CreateTicketCommentCommandResponse } from '../models/CreateTicketCommentCommandResponse';
import type { DeleteTicketCommentCommandResponse } from '../models/DeleteTicketCommentCommandResponse';
import type { GetTicketCommentDetailQueryResponse } from '../models/GetTicketCommentDetailQueryResponse';
import type { GetTicketCommentListQueryResponse } from '../models/GetTicketCommentListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateTicketCommentCommand } from '../models/UpdateTicketCommentCommand';
import type { UpdateTicketCommentCommandResponse } from '../models/UpdateTicketCommentCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TicketCommentService {
    /**
     * @param version
     * @param ticketId
     * @returns GetTicketCommentListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVTicketComment(
        version: string,
        ticketId?: string,
    ): CancelablePromise<GetTicketCommentListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TicketComment',
            path: {
                'version': version,
            },
            query: {
                'ticketId': ticketId,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateTicketCommentCommandResponse Success
     * @throws ApiError
     */
    public static postApiVTicketComment(
        version: string,
        requestBody?: CreateTicketCommentCommand,
    ): CancelablePromise<CreateTicketCommentCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/TicketComment',
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
     * @returns UpdateTicketCommentCommandResponse Success
     * @throws ApiError
     */
    public static putApiVTicketComment(
        version: string,
        requestBody?: UpdateTicketCommentCommand,
    ): CancelablePromise<UpdateTicketCommentCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/TicketComment',
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
     * @returns GetTicketCommentDetailQueryResponse Success
     * @throws ApiError
     */
    public static getTicketCommentById(
        id: string,
        version: string,
    ): CancelablePromise<GetTicketCommentDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TicketComment/{id}',
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
     * @returns DeleteTicketCommentCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteTicketComment(
        id: string,
        version: string,
    ): CancelablePromise<DeleteTicketCommentCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/TicketComment/{id}',
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
