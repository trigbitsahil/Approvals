/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateBillingItemCommand } from '../models/CreateBillingItemCommand';
import type { CreateBillingItemCommandResponse } from '../models/CreateBillingItemCommandResponse';
import type { DeleteBillingItemCommandResponse } from '../models/DeleteBillingItemCommandResponse';
import type { GetBillingItemDetailQueryResponse } from '../models/GetBillingItemDetailQueryResponse';
import type { GetBillingItemListQueryResponse } from '../models/GetBillingItemListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateBillingItemCommand } from '../models/UpdateBillingItemCommand';
import type { UpdateBillingItemCommandResponse } from '../models/UpdateBillingItemCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BillingItemService {
    /**
     * @param version
     * @returns GetBillingItemListQueryResponse Success
     * @throws ApiError
     */
    public static billingItemGet(
        version: string,
    ): CancelablePromise<GetBillingItemListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/BillingItem',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateBillingItemCommandResponse Success
     * @throws ApiError
     */
    public static billingItemPost(
        version: string,
        requestBody?: CreateBillingItemCommand,
    ): CancelablePromise<CreateBillingItemCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/BillingItem',
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
     * @returns UpdateBillingItemCommandResponse Success
     * @throws ApiError
     */
    public static billingItemPut(
        version: string,
        requestBody?: UpdateBillingItemCommand,
    ): CancelablePromise<UpdateBillingItemCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/BillingItem',
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
     * @returns GetBillingItemDetailQueryResponse Success
     * @throws ApiError
     */
    public static getBillingItemById(
        id: string,
        version: string,
    ): CancelablePromise<GetBillingItemDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/BillingItem/{id}',
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
     * @returns DeleteBillingItemCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteBillingItem(
        id: string,
        version: string,
    ): CancelablePromise<DeleteBillingItemCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/BillingItem/{id}',
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
