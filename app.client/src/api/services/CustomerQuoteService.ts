/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCustomerQuoteCommand } from '../models/CreateCustomerQuoteCommand';
import type { CreateCustomerQuoteCommandResponse } from '../models/CreateCustomerQuoteCommandResponse';
import type { DeleteCustomerQuoteCommandResponse } from '../models/DeleteCustomerQuoteCommandResponse';
import type { GetCustomerQuoteDetailQueryResponse } from '../models/GetCustomerQuoteDetailQueryResponse';
import type { GetCustomerQuoteListQueryResponse } from '../models/GetCustomerQuoteListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateCustomerQuoteCommand } from '../models/UpdateCustomerQuoteCommand';
import type { UpdateCustomerQuoteCommandResponse } from '../models/UpdateCustomerQuoteCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CustomerQuoteService {
    /**
     * @param version
     * @returns GetCustomerQuoteListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVCustomerQuote(
        version: string,
    ): CancelablePromise<GetCustomerQuoteListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/CustomerQuote',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateCustomerQuoteCommandResponse Success
     * @throws ApiError
     */
    public static postApiVCustomerQuote(
        version: string,
        requestBody?: CreateCustomerQuoteCommand,
    ): CancelablePromise<CreateCustomerQuoteCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/CustomerQuote',
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
     * @returns UpdateCustomerQuoteCommandResponse Success
     * @throws ApiError
     */
    public static putApiVCustomerQuote(
        version: string,
        requestBody?: UpdateCustomerQuoteCommand,
    ): CancelablePromise<UpdateCustomerQuoteCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/CustomerQuote',
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
     * @returns GetCustomerQuoteDetailQueryResponse Success
     * @throws ApiError
     */
    public static getCustomerQuoteById(
        id: string,
        version: string,
    ): CancelablePromise<GetCustomerQuoteDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/CustomerQuote/{id}',
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
     * @returns DeleteCustomerQuoteCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteCustomerQuote(
        id: string,
        version: string,
    ): CancelablePromise<DeleteCustomerQuoteCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/CustomerQuote/{id}',
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
