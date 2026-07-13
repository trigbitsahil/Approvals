/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateContactCommand } from '../models/CreateContactCommand';
import type { CreateContactCommandResponse } from '../models/CreateContactCommandResponse';
import type { DeleteContactCommandResponse } from '../models/DeleteContactCommandResponse';
import type { GetContactDetailQueryResponse } from '../models/GetContactDetailQueryResponse';
import type { GetContactListQueryResponse } from '../models/GetContactListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateContactCommand } from '../models/UpdateContactCommand';
import type { UpdateContactCommandResponse } from '../models/UpdateContactCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ContactService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetContactListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVContact(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetContactListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Contact',
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
     * @returns CreateContactCommandResponse Success
     * @throws ApiError
     */
    public static postApiVContact(
        version: string,
        requestBody?: CreateContactCommand,
    ): CancelablePromise<CreateContactCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Contact',
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
     * @returns UpdateContactCommandResponse Success
     * @throws ApiError
     */
    public static putApiVContact(
        version: string,
        requestBody?: UpdateContactCommand,
    ): CancelablePromise<UpdateContactCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Contact',
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
     * @returns GetContactDetailQueryResponse Success
     * @throws ApiError
     */
    public static getContactById(
        id: string,
        version: string,
    ): CancelablePromise<GetContactDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Contact/{id}',
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
     * @returns DeleteContactCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteContact(
        id: string,
        version: string,
    ): CancelablePromise<DeleteContactCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/Contact/{id}',
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
