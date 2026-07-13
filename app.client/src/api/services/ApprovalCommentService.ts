/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateApprovalCommentCommand } from '../models/CreateApprovalCommentCommand';
import type { CreateApprovalCommentCommandResponse } from '../models/CreateApprovalCommentCommandResponse';
import type { DeleteApprovalCommentCommandResponse } from '../models/DeleteApprovalCommentCommandResponse';
import type { GetApprovalCommentDetailQueryResponse } from '../models/GetApprovalCommentDetailQueryResponse';
import type { GetApprovalCommentListQueryResponse } from '../models/GetApprovalCommentListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateApprovalCommentCommand } from '../models/UpdateApprovalCommentCommand';
import type { UpdateApprovalCommentCommandResponse } from '../models/UpdateApprovalCommentCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApprovalCommentService {
    /**
     * @param version
     * @param approvalId
     * @returns GetApprovalCommentListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVApprovalComment(
        version: string,
        approvalId?: string,
    ): CancelablePromise<GetApprovalCommentListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ApprovalComment',
            path: {
                'version': version,
            },
            query: {
                'approvalID': approvalId,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateApprovalCommentCommandResponse Success
     * @throws ApiError
     */
    public static postApiVApprovalComment(
        version: string,
        requestBody?: CreateApprovalCommentCommand,
    ): CancelablePromise<CreateApprovalCommentCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ApprovalComment',
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
     * @returns UpdateApprovalCommentCommandResponse Success
     * @throws ApiError
     */
    public static putApiVApprovalComment(
        version: string,
        requestBody?: UpdateApprovalCommentCommand,
    ): CancelablePromise<UpdateApprovalCommentCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ApprovalComment',
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
     * @returns GetApprovalCommentDetailQueryResponse Success
     * @throws ApiError
     */
    public static getApprovalCommentById(
        id: string,
        version: string,
    ): CancelablePromise<GetApprovalCommentDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ApprovalComment/{id}',
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
     * @returns DeleteApprovalCommentCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteApprovalComment(
        id: string,
        version: string,
    ): CancelablePromise<DeleteApprovalCommentCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ApprovalComment/{id}',
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
