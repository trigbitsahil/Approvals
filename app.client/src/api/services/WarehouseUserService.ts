/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateWarehouseUserCommand } from '../models/CreateWarehouseUserCommand';
import type { CreateWarehouseUserCommandResponse } from '../models/CreateWarehouseUserCommandResponse';
import type { GetWarehouseUserListQueryResponse } from '../models/GetWarehouseUserListQueryResponse';
import type { UpdateWarehouseUserCommand } from '../models/UpdateWarehouseUserCommand';
import type { UpdateWarehouseUserCommandResponse } from '../models/UpdateWarehouseUserCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WarehouseUserService {
    /**
     * @param version
     * @returns GetWarehouseUserListQueryResponse Success
     * @throws ApiError
     */
    public static warehouseUserGet(
        version: string,
    ): CancelablePromise<GetWarehouseUserListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/WarehouseUser',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateWarehouseUserCommandResponse Success
     * @throws ApiError
     */
    public static warehouseUserPost(
        version: string,
        requestBody?: CreateWarehouseUserCommand,
    ): CancelablePromise<CreateWarehouseUserCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/WarehouseUser',
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
     * @returns UpdateWarehouseUserCommandResponse Success
     * @throws ApiError
     */
    public static warehouseUserPut(
        version: string,
        requestBody?: UpdateWarehouseUserCommand,
    ): CancelablePromise<UpdateWarehouseUserCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/WarehouseUser',
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

}
