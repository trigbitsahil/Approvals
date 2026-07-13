/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateInventoryItemCommand } from "../models/CreateInventoryItemCommand";
import type { CreateInventoryItemCommandResponse } from "../models/CreateInventoryItemCommandResponse";
import type { GetInventoryItemListQueryResponse } from "../models/GetInventoryItemListQueryResponse";
import type { UpdateInventoryItemCommand } from "../models/UpdateInventoryItemCommand";
import type { UpdateInventoryItemCommandResponse } from "../models/UpdateInventoryItemCommandResponse";
import type { GetInventoryItemDetailByCodeQueryResponse } from '../models/GetInventoryItemDetailByCodeQueryResponse';
import type { GetInventoryItemCountInfoQueryResponse } from '../models/GetInventoryItemCountInfoQueryResponse';
import type { GetInventoryItemInfoByCodeQueryResponse } from '../models/GetInventoryItemInfoByCodeQueryResponse';
import type { GetInventoryItemInTransactionListQueryResponse } from '../models/GetInventoryItemInTransactionListQueryResponse';

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class InventoryItemService {
    /**
     * @param version
     * @returns GetInventoryItemListQueryResponse Success
     * @throws ApiError
     */
    public static inventoryItemGet(
        version: string,
    ): CancelablePromise<GetInventoryItemListQueryResponse> {
        return __request(OpenAPI, {
            method: "GET",
            url: "/api/v{version}/inventoryitem",
            path: {
                version: version,
            },
        });
    }

    /**
     * @param version
     * @param requestBody
     * @returns CreateInventoryItemCommandResponse Success
     * @throws ApiError
     */
    public static inventoryItemPost(
        version: string,
        requestBody?: CreateInventoryItemCommand,
    ): CancelablePromise<CreateInventoryItemCommandResponse> {
        return __request(OpenAPI, {
            method: "POST",
            url: "/api/v{version}/inventoryitem",
            path: {
                version: version,
            },
            body: requestBody,
            mediaType: "application/json",
            errors: {
                400: `Bad Request`,
            },
        });
    }

    /**
     * @param version
     * @param requestBody
     * @returns UpdateInventoryItemCommandResponse Success
     * @throws ApiError
     */
    public static inventoryItemPut(
        version: string,
        requestBody?: UpdateInventoryItemCommand,
    ): CancelablePromise<UpdateInventoryItemCommandResponse> {
        return __request(OpenAPI, {
            method: "PUT",
            url: "/api/v{version}/inventoryitem",
            path: {
                version: version,
            },
            body: requestBody,
            mediaType: "application/json",
            errors: {
                400: `Bad Request`,
            },
        });
    }

    /**
     * @param id
     * @param version
     * @returns GetInventoryItemDetailByCodeQueryResponse Success
     * @throws ApiError
     */
    public static getInventoryItemById(
        id: string,
        version: string,
    ): CancelablePromise<GetInventoryItemDetailByCodeQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/inventoryitem/{id}',
            path: {
                id: id,
                version: version,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @param id
     * @param version
     * @returns any Success
     * @throws ApiError
     */
    public static deleteInventoryItem(
        id: string,
        version: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: "DELETE",
            url: "/api/v{version}/inventoryitem/{id}",
            path: {
                id: id,
                version: version,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
        * @param version
        * @param code
        * @returns GetInventoryItemDetailByCodeQueryResponse Success
        * @throws ApiError
        */
    public static getInventoryItemByCode(
        version: string,
        code?: string,
    ): CancelablePromise<GetInventoryItemDetailByCodeQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/InventoryItem/GetInventoryItemByCode',
            path: {
                'version': version,
            },
            query: {
                'code': code,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
      * @param version
      * @param code
      * @param warehouseId
      * @returns GetInventoryItemInfoByCodeQueryResponse Success
      * @throws ApiError
      */
    public static getInventoryItemInfo(
        version: string,
        code?: string,
        warehouseId?: string,
    ): CancelablePromise<GetInventoryItemInfoByCodeQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/InventoryItem/GetInventoryItemInfo',
            path: {
                'version': version,
            },
            query: {
                'code': code,
                'warehouseId': warehouseId,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
     * @param version
     * @param code
     * @param location
     * @param lotNum
     * @param warehouseId
     * @returns GetInventoryItemCountInfoQueryResponse Success
     * @throws ApiError
     */
    public static getInventoryItemCountInfo(
        version: string,
        code?: string,
        location?: string,
        lotNum?: string,
        warehouseId?: string,
    ): CancelablePromise<GetInventoryItemCountInfoQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/InventoryItem/GetInventoryItemCountInfo',
            path: {
                'version': version,
            },
            query: {
                'code': code,
                'location': location,
                'lotNum': lotNum,
                'warehouseId': warehouseId,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
        * @param version
        * @returns GetInventoryItemInTransactionListQueryResponse Success
        * @throws ApiError
        */
    public static getInventoryItemInTransactionList(
        version: string,
    ): CancelablePromise<GetInventoryItemInTransactionListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/InventoryItem/GetInventoryItemInTransactionList',
            path: {
                'version': version,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
}
