/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateApprovalStatusCommand } from '../models/CreateApprovalStatusCommand';
import type { CreateApprovalStatusCommandResponse } from '../models/CreateApprovalStatusCommandResponse';
import type { DeleteApprovalStatusCommandResponse } from '../models/DeleteApprovalStatusCommandResponse';
import type { GetApprovalStatusDetailQueryResponse } from '../models/GetApprovalStatusDetailQueryResponse';
import type { GetApprovalStatusListQueryResponse } from '../models/GetApprovalStatusListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateApprovalStatusCommand } from '../models/UpdateApprovalStatusCommand';
import type { UpdateApprovalStatusCommandResponse } from '../models/UpdateApprovalStatusCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApprovalStatusService {
    /**
     * @param version
     * @returns GetApprovalStatusListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVApprovalStatus(
        version: string,
    ): CancelablePromise<GetApprovalStatusListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ApprovalStatus',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateApprovalStatusCommandResponse Success
     * @throws ApiError
     */
    public static postApiVApprovalStatus(
        version: string,
        requestBody?: CreateApprovalStatusCommand,
    ): CancelablePromise<CreateApprovalStatusCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ApprovalStatus',
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
     * @returns UpdateApprovalStatusCommandResponse Success
     * @throws ApiError
     */
    public static putApiVApprovalStatus(
        version: string,
        requestBody?: UpdateApprovalStatusCommand,
    ): CancelablePromise<UpdateApprovalStatusCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ApprovalStatus',
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
     * @returns GetApprovalStatusDetailQueryResponse Success
     * @throws ApiError
     */
    public static getApprovalStatusById(
        id: string,
        version: string,
    ): CancelablePromise<GetApprovalStatusDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ApprovalStatus/{id}',
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
     * @returns DeleteApprovalStatusCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteApprovalStatus(
        id: string,
        version: string,
    ): CancelablePromise<DeleteApprovalStatusCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ApprovalStatus/{id}',
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
