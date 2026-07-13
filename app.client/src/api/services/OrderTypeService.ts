/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { GetOrderTypeListQueryResponse } from '../models/GetOrderTypeListQueryResponse';
import { CreateOrderTypeCommand } from '../models/CreateOrderTypeCommand';
import { CreateOrderTypeCommandResponse } from '../models/CreateOrderTypeCommandResponse';
import { UpdateOrderTypeCommand } from '../models/UpdateOrderTypeCommand';
import { UpdateOrderTypeCommandResponse } from '../models/UpdateOrderTypeCommandResponse';
import { GetOrderTypeDetailQueryResponse } from '../models/GetOrderTypeDetailQueryResponse';
import { DeleteOrderTypeCommandResponse } from '../models/DeleteOrderTypeCommandResponse';
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class OrderTypeService {
    /**
     * @param version
     * @returns GetOrderTypeListQueryResponse Success
     * @throws ApiError
     */
    public static orderTypeGet(
        version: string,
    ): CancelablePromise<GetOrderTypeListQueryResponse> {
        return __request(OpenAPI, {
            method: "GET",
            url: "/api/v{version}/OrderType",
            path: {
                version: version,
            },
        });
    }

    /**
     * @param version
     * @param requestBody
     * @returns CreateOrderTypeCommandResponse Success
     * @throws ApiError
     */
    public static orderTypePost(
        version: string,
        requestBody?: CreateOrderTypeCommand,
    ): CancelablePromise<CreateOrderTypeCommandResponse> {
        return __request(OpenAPI, {
            method: "POST",
            url: "/api/v{version}/OrderType",
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
     * @returns UpdateOrderTypeCommandResponse Success
     * @throws ApiError
     */
    public static orderTypePut(
        version: string,
        requestBody?: UpdateOrderTypeCommand,
    ): CancelablePromise<UpdateOrderTypeCommandResponse> {
        return __request(OpenAPI, {
            method: "PUT",
            url: "/api/v{version}/OrderType",
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
     * @returns GetOrderTypeDetailQueryResponse Success
     * @throws ApiError
     */
    public static getOrderTypeById(
        id: string,
        version: string,
    ): CancelablePromise<GetOrderTypeDetailQueryResponse> {
        return __request(OpenAPI, {
            method: "GET",
            url: "/api/v{version}/OrderType/{id}",
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
     * @returns DeleteOrderTypeCommandResponse Success
     * @throws ApiError
     */
    public static deleteOrderType(
        id: string,
        version: string,
    ): CancelablePromise<DeleteOrderTypeCommandResponse> {
        return __request(OpenAPI, {
            method: "DELETE",
            url: "/api/v{version}/OrderType/{id}",
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
