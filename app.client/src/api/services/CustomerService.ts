/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCustomerCommand } from '../models/CreateCustomerCommand';
import type { CreateCustomerCommandResponse } from '../models/CreateCustomerCommandResponse';
import type { DeleteCustomerCommandResponse } from '../models/DeleteCustomerCommandResponse';
import type { GetCustomerDetailQueryResponse } from '../models/GetCustomerDetailQueryResponse';
import type { GetCustomerListQueryResponse } from '../models/GetCustomerListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateCustomerCommand } from '../models/UpdateCustomerCommand';
import type { UpdateCustomerCommandResponse } from '../models/UpdateCustomerCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CustomerService {
    /**
     * @param version
     * @returns GetCustomerListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVCustomer(
        version: string,
    ): CancelablePromise<GetCustomerListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Customer',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateCustomerCommandResponse Success
     * @throws ApiError
     */
    public static postApiVCustomer(
        version: string,
        requestBody?: CreateCustomerCommand,
    ): CancelablePromise<CreateCustomerCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Customer',
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
     * @returns UpdateCustomerCommandResponse Success
     * @throws ApiError
     */
    public static putApiVCustomer(
        version: string,
        requestBody?: UpdateCustomerCommand,
    ): CancelablePromise<UpdateCustomerCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Customer',
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
     * @returns GetCustomerDetailQueryResponse Success
     * @throws ApiError
     */
    public static getCustomerById(
        id: string,
        version: string,
    ): CancelablePromise<GetCustomerDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Customer/{id}',
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
     * @returns DeleteCustomerCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteCustomer(
        id: string,
        version: string,
    ): CancelablePromise<DeleteCustomerCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/Customer/{id}',
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
