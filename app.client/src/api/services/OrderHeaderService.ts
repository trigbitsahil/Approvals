/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderHeaderListVM } from '../models/OrderHeaderListVM';
import { GetOrderHeaderListQueryResponse } from '../models/GetOrderHeaderListQueryResponse';
import { CreateOrderHeaderCommand } from '../models/CreateOrderHeaderCommand';
import { CreateOrderHeaderCommandResponse } from '../models/CreateOrderHeaderCommandResponse';
import { UpdateOrderHeaderCommand } from '../models/UpdateOrderHeaderCommand';
import { UpdateOrderHeaderCommandResponse } from '../models/UpdateOrderHeaderCommandResponse';
import { GetOrderHeaderDetailQueryResponse } from '../models/GetOrderHeaderDetailQueryResponse';
import { DeleteOrderHeaderCommandResponse } from '../models/DeleteOrderHeaderCommandResponse';
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class OrderHeaderService {
    /**
     * @param version
     * @param type
     * @param warehouseId
     * @returns GetOrderHeaderListQueryResponse Success
     * @throws ApiError
     */
    public static orderHeaderGet(
        version: string,
        type?: number,
        warehouseId?: string,
    ): CancelablePromise<GetOrderHeaderListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OrderHeader',
            path: {
                'version': version,
            },
            query: {
                'type': type,
                'warehouseId': warehouseId,
            },
        });
    }

    /**
     * @param version
     * @param requestBody
     * @returns CreateOrderHeaderCommandResponse Success
     * @throws ApiError
     */
    public static orderHeaderPost(
        version: string,
        requestBody?: CreateOrderHeaderCommand,
    ): CancelablePromise<CreateOrderHeaderCommandResponse> {
        return __request(OpenAPI, {
            method: "POST",
            url: "/api/v{version}/OrderHeader",
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
     * @returns UpdateOrderHeaderCommandResponse Success
     * @throws ApiError
     */
    public static orderHeaderPut(
        version: string,
        requestBody?: UpdateOrderHeaderCommand,
    ): CancelablePromise<UpdateOrderHeaderCommandResponse> {
        return __request(OpenAPI, {
            method: "PUT",
            url: "/api/v{version}/OrderHeader",
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
     * @returns GetOrderHeaderDetailQueryResponse Success
     * @throws ApiError
     */
    public static getOrderHeaderById(
        id: string,
        version: string,
    ): CancelablePromise<GetOrderHeaderDetailQueryResponse> {
        return __request(OpenAPI, {
            method: "GET",
            url: "/api/v{version}/OrderHeader/{id}",
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
     * @returns DeleteOrderHeaderCommandResponse Success
     * @throws ApiError
     */
    public static deleteOrderHeader(
        id: string,
        version: string,
    ): CancelablePromise<DeleteOrderHeaderCommandResponse> {
        return __request(OpenAPI, {
            method: "DELETE",
            url: "/api/v{version}/OrderHeader/{id}",
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
