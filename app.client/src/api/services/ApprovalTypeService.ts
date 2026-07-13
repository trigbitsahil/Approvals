/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateApprovalTypeCommand } from '../models/CreateApprovalTypeCommand';
import type { CreateApprovalTypeCommandResponse } from '../models/CreateApprovalTypeCommandResponse';
import type { DeleteApprovalTypeCommandResponse } from '../models/DeleteApprovalTypeCommandResponse';
import type { GetApprovalTypeDetailQueryResponse } from '../models/GetApprovalTypeDetailQueryResponse';
import type { GetApprovalTypeListQueryResponse } from '../models/GetApprovalTypeListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateApprovalTypeCommand } from '../models/UpdateApprovalTypeCommand';
import type { UpdateApprovalTypeCommandResponse } from '../models/UpdateApprovalTypeCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApprovalTypeService {
    /**
     * @param version
     * @returns GetApprovalTypeListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVApprovalType(
        version: string,
    ): CancelablePromise<GetApprovalTypeListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ApprovalType',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateApprovalTypeCommandResponse Success
     * @throws ApiError
     */
    public static postApiVApprovalType(
        version: string,
        requestBody?: CreateApprovalTypeCommand,
    ): CancelablePromise<CreateApprovalTypeCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ApprovalType',
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
     * @returns UpdateApprovalTypeCommandResponse Success
     * @throws ApiError
     */
    public static putApiVApprovalType(
        version: string,
        requestBody?: UpdateApprovalTypeCommand,
    ): CancelablePromise<UpdateApprovalTypeCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ApprovalType',
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
     * @returns GetApprovalTypeDetailQueryResponse Success
     * @throws ApiError
     */
    public static getApprovalTypeById(
        id: string,
        version: string,
    ): CancelablePromise<GetApprovalTypeDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ApprovalType/{id}',
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
     * @returns DeleteApprovalTypeCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteApprovalType(
        id: string,
        version: string,
    ): CancelablePromise<DeleteApprovalTypeCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ApprovalType/{id}',
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
