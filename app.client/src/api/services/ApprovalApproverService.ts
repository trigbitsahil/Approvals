/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateApprovalApproverCommand } from '../models/CreateApprovalApproverCommand';
import type { CreateApprovalApproverCommandResponse } from '../models/CreateApprovalApproverCommandResponse';
import type { DeleteApprovalApproverCommandResponse } from '../models/DeleteApprovalApproverCommandResponse';
import type { GetApprovalApproverDetailQueryResponse } from '../models/GetApprovalApproverDetailQueryResponse';
import type { GetApprovalApproverListQueryResponse } from '../models/GetApprovalApproverListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateApprovalApproverCommand } from '../models/UpdateApprovalApproverCommand';
import type { UpdateApprovalApproverCommandResponse } from '../models/UpdateApprovalApproverCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApprovalApproverService {
    /**
     * @param version
     * @param approvalId
     * @returns GetApprovalApproverListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVApprovalApprover(
        version: string,
        approvalId?: string,
    ): CancelablePromise<GetApprovalApproverListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ApprovalApprover',
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
     * @returns CreateApprovalApproverCommandResponse Success
     * @throws ApiError
     */
    public static postApiVApprovalApprover(
        version: string,
        requestBody?: CreateApprovalApproverCommand,
    ): CancelablePromise<CreateApprovalApproverCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ApprovalApprover',
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
     * @returns UpdateApprovalApproverCommandResponse Success
     * @throws ApiError
     */
    public static putApiVApprovalApprover(
        version: string,
        requestBody?: UpdateApprovalApproverCommand,
    ): CancelablePromise<UpdateApprovalApproverCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ApprovalApprover',
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
     * @returns GetApprovalApproverDetailQueryResponse Success
     * @throws ApiError
     */
    public static getApprovalApproverById(
        id: string,
        version: string,
    ): CancelablePromise<GetApprovalApproverDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ApprovalApprover/{id}',
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
     * @returns DeleteApprovalApproverCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteApprovalApprover(
        id: string,
        version: string,
    ): CancelablePromise<DeleteApprovalApproverCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ApprovalApprover/{id}',
            path: {
                'id': id,
                'version': version,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param version
     * @param approvalId
     * @returns DeleteApprovalApproverCommandResponse Success
     * @throws ApiError
     */
    public static sendFollowUpEmail(
        version: string,
        approvalId?: string,
    ): CancelablePromise<DeleteApprovalApproverCommandResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ApprovalApprover/SendFollowUpEmail',
            path: {
                'version': version,
            },
            query: {
                'approvalID': approvalId,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
