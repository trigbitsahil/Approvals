/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTagIntermediateCommand } from '../models/CreateTagIntermediateCommand';
import type { CreateTagIntermediateCommandResponse } from '../models/CreateTagIntermediateCommandResponse';
import type { DeleteTagIntermediateCommandResponse } from '../models/DeleteTagIntermediateCommandResponse';
import type { GetTagIntermediateDetailQueryResponse } from '../models/GetTagIntermediateDetailQueryResponse';
import type { GetTagIntermediateListQueryResponse } from '../models/GetTagIntermediateListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateTagIntermediateCommand } from '../models/UpdateTagIntermediateCommand';
import type { UpdateTagIntermediateCommandResponse } from '../models/UpdateTagIntermediateCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TagIntermediateService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetTagIntermediateListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVTagIntermediate(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetTagIntermediateListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TagIntermediate',
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
     * @returns CreateTagIntermediateCommandResponse Success
     * @throws ApiError
     */
    public static postApiVTagIntermediate(
        version: string,
        requestBody?: CreateTagIntermediateCommand,
    ): CancelablePromise<CreateTagIntermediateCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/TagIntermediate',
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
     * @returns UpdateTagIntermediateCommandResponse Success
     * @throws ApiError
     */
    public static putApiVTagIntermediate(
        version: string,
        requestBody?: UpdateTagIntermediateCommand,
    ): CancelablePromise<UpdateTagIntermediateCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/TagIntermediate',
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
     * @returns GetTagIntermediateDetailQueryResponse Success
     * @throws ApiError
     */
    public static getTagIntermediateById(
        id: string,
        version: string,
    ): CancelablePromise<GetTagIntermediateDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TagIntermediate/{id}',
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
     * @returns DeleteTagIntermediateCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteTagIntermediate(
        id: string,
        version: string,
    ): CancelablePromise<DeleteTagIntermediateCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/TagIntermediate/{id}',
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
