/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSopCommand } from '../models/CreateSopCommand';
import type { CreateSopCommandResponse } from '../models/CreateSopCommandResponse';
import type { DeleteSopCommandResponse } from '../models/DeleteSopCommandResponse';
import type { GetSopDetailQueryResponse } from '../models/GetSopDetailQueryResponse';
import type { GetSopListQueryResponse } from '../models/GetSopListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateSopCommand } from '../models/UpdateSopCommand';
import type { UpdateSopCommandResponse } from '../models/UpdateSopCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SopService {
    /**
     * @param version
     * @returns GetSopListQueryResponse OK
     * @throws ApiError
     */
    public static getApiVSop(
        version: string,
    ): CancelablePromise<GetSopListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Sop',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateSopCommandResponse OK
     * @throws ApiError
     */
    public static postApiVSop(
        version: string,
        requestBody?: CreateSopCommand,
    ): CancelablePromise<CreateSopCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Sop',
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
     * @returns UpdateSopCommandResponse OK
     * @throws ApiError
     */
    public static putApiVSop(
        version: string,
        requestBody?: UpdateSopCommand,
    ): CancelablePromise<UpdateSopCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Sop',
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
     * @returns GetSopListQueryResponse OK
     * @throws ApiError
     */
    public static getMySopList(
        version: string,
    ): CancelablePromise<GetSopListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Sop/GetMySopList',
            path: {
                'version': version,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }
    /**
     * @param id
     * @param version
     * @returns GetSopDetailQueryResponse OK
     * @throws ApiError
     */
    public static getSopById(
        id: string,
        version: string,
    ): CancelablePromise<GetSopDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Sop/{id}',
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
     * @returns DeleteSopCommandResponse OK
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteSop(
        id: string,
        version: string,
    ): CancelablePromise<DeleteSopCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/Sop/{id}',
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
