/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCustomerQuoteLineCommand } from '../models/CreateCustomerQuoteLineCommand';
import type { CreateCustomerQuoteLineCommandResponse } from '../models/CreateCustomerQuoteLineCommandResponse';
import type { DeleteCustomerQuoteLineCommandResponse } from '../models/DeleteCustomerQuoteLineCommandResponse';
import type { GetCustomerQuoteLineDetailQueryResponse } from '../models/GetCustomerQuoteLineDetailQueryResponse';
import type { GetCustomerQuoteLineListQueryResponse } from '../models/GetCustomerQuoteLineListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateCustomerQuoteLineCommand } from '../models/UpdateCustomerQuoteLineCommand';
import type { UpdateCustomerQuoteLineCommandResponse } from '../models/UpdateCustomerQuoteLineCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CustomerQuoteLineService {
    /**
     * @param version
     * @returns GetCustomerQuoteLineListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVCustomerQuoteLine(
        version: string,
    ): CancelablePromise<GetCustomerQuoteLineListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/CustomerQuoteLine',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateCustomerQuoteLineCommandResponse Success
     * @throws ApiError
     */
    public static postApiVCustomerQuoteLine(
        version: string,
        requestBody?: CreateCustomerQuoteLineCommand,
    ): CancelablePromise<CreateCustomerQuoteLineCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/CustomerQuoteLine',
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
     * @returns UpdateCustomerQuoteLineCommandResponse Success
     * @throws ApiError
     */
    public static putApiVCustomerQuoteLine(
        version: string,
        requestBody?: UpdateCustomerQuoteLineCommand,
    ): CancelablePromise<UpdateCustomerQuoteLineCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/CustomerQuoteLine',
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
     * @returns GetCustomerQuoteLineDetailQueryResponse Success
     * @throws ApiError
     */
    public static getCustomerQuoteLineById(
        id: string,
        version: string,
    ): CancelablePromise<GetCustomerQuoteLineDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/CustomerQuoteLine/{id}',
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
     * @returns DeleteCustomerQuoteLineCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteCustomerQuoteLine(
        id: string,
        version: string,
    ): CancelablePromise<DeleteCustomerQuoteLineCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/CustomerQuoteLine/{id}',
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
