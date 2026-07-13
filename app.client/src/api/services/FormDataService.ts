/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateFormDataCommand } from '../models/CreateFormDataCommand';
import type { CreateFormDataCommandResponse } from '../models/CreateFormDataCommandResponse';
import type { DeleteFormDataCommandResponse } from '../models/DeleteFormDataCommandResponse';
import type { GetFormDataDetailQueryResponse } from '../models/GetFormDataDetailQueryResponse';
import type { GetFormDataListQueryResponse } from '../models/GetFormDataListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateFormDataCommand } from '../models/UpdateFormDataCommand';
import type { UpdateFormDataCommandResponse } from '../models/UpdateFormDataCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FormDataService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetFormDataListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVFormData(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetFormDataListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/FormData',
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
     * @returns CreateFormDataCommandResponse Success
     * @throws ApiError
     */
    public static postApiVFormData(
        version: string,
        requestBody?: CreateFormDataCommand,
    ): CancelablePromise<CreateFormDataCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/FormData',
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
     * @returns UpdateFormDataCommandResponse Success
     * @throws ApiError
     */
    public static putApiVFormData(
        version: string,
        requestBody?: UpdateFormDataCommand,
    ): CancelablePromise<UpdateFormDataCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/FormData',
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
     * @returns GetFormDataDetailQueryResponse Success
     * @throws ApiError
     */
    public static getFormDataById(
        id: string,
        version: string,
    ): CancelablePromise<GetFormDataDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/FormData/{id}',
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
     * @returns DeleteFormDataCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteFormData(
        id: string,
        version: string,
    ): CancelablePromise<DeleteFormDataCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/FormData/{id}',
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
