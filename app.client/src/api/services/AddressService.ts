/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateAddressCommand } from '../models/CreateAddressCommand';
import type { CreateAddressCommandResponse } from '../models/CreateAddressCommandResponse';
import type { DeleteAddressCommandResponse } from '../models/DeleteAddressCommandResponse';
import type { GetAddressDetailQueryResponse } from '../models/GetAddressDetailQueryResponse';
import type { GetAddressListQueryResponse } from '../models/GetAddressListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateAddressCommand } from '../models/UpdateAddressCommand';
import type { UpdateAddressCommandResponse } from '../models/UpdateAddressCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AddressService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetAddressListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVAddress(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetAddressListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Address',
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
     * @returns CreateAddressCommandResponse Success
     * @throws ApiError
     */
    public static postApiVAddress(
        version: string,
        requestBody?: CreateAddressCommand,
    ): CancelablePromise<CreateAddressCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Address',
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
     * @returns UpdateAddressCommandResponse Success
     * @throws ApiError
     */
    public static putApiVAddress(
        version: string,
        requestBody?: UpdateAddressCommand,
    ): CancelablePromise<UpdateAddressCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Address',
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
     * @returns GetAddressDetailQueryResponse Success
     * @throws ApiError
     */
    public static getAddressById(
        id: string,
        version: string,
    ): CancelablePromise<GetAddressDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Address/{id}',
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
     * @returns DeleteAddressCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteAddress(
        id: string,
        version: string,
    ): CancelablePromise<DeleteAddressCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/Address/{id}',
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
