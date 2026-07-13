/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class InventoryItemTypeService {
    /**
     * @param version
     * @returns any Success
     * @throws ApiError
     */
    public static inventoryItemTypeGet(
        version: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: "GET",
            url: "/api/v{version}/InventoryItemType",
            path: {
                version: version,
            },
        });
    }

    /**
     * @param version
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static inventoryItemTypePost(
        version: string,
        requestBody?: {
            name: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: "POST",
            url: "/api/v{version}/InventoryItemType",
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
     * @returns any Success
     * @throws ApiError
     */
    public static inventoryItemTypePut(
        version: string,
        requestBody?: {
            name: string;
            inventoryItemTypeId: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: "PUT",
            url: "/api/v{version}/InventoryItemType",
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
     * @returns any Success
     * @throws ApiError
     */
    public static deleteInventoryItemType(
        id: string,
        version: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: "DELETE",
            url: "/api/v{version}/InventoryItemType/{id}",
            path: {
                id: id,
                version: version,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
