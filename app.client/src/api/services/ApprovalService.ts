/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateApprovalCommand } from '../models/CreateApprovalCommand';
import type { CreateApprovalCommandResponse } from '../models/CreateApprovalCommandResponse';
import type { DeleteApprovalCommandResponse } from '../models/DeleteApprovalCommandResponse';
import type { GetApprovalDetailQueryResponse } from '../models/GetApprovalDetailQueryResponse';
import type { GetApprovalListQueryResponse } from '../models/GetApprovalListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateApprovalCommand } from '../models/UpdateApprovalCommand';
import type { UpdateApprovalCommandResponse } from '../models/UpdateApprovalCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApprovalService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetApprovalListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVApproval(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetApprovalListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Approval',
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
     * @returns CreateApprovalCommandResponse Success
     * @throws ApiError
     */
    public static postApiVApproval(
        version: string,
        requestBody?: CreateApprovalCommand,
    ): CancelablePromise<CreateApprovalCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Approval',
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
     * @returns UpdateApprovalCommandResponse Success
     * @throws ApiError
     */
    public static putApiVApproval(
        version: string,
        requestBody?: UpdateApprovalCommand,
    ): CancelablePromise<UpdateApprovalCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Approval',
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
     * @returns GetApprovalListQueryResponse Success
     * @throws ApiError
     */
    public static getApprovalListByUser(
        version: string,
    ): CancelablePromise<GetApprovalListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Approval/GetApprovalListByUser',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param id
     * @param version
     * @returns GetApprovalDetailQueryResponse Success
     * @throws ApiError
     */
    public static getApprovalById(
        id: string,
        version: string,
    ): CancelablePromise<GetApprovalDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Approval/{id}',
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
     * @returns DeleteApprovalCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteApproval(
        id: string,
        version: string,
    ): CancelablePromise<DeleteApprovalCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/Approval/{id}',
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
