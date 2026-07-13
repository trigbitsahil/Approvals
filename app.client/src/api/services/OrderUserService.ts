/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { GetOrderUserListQueryResponse } from '../models/GetOrderUserListQueryResponse';
import { CreateOrderUserCommand } from '../models/CreateOrderUserCommand';
import { CreateOrderUserCommandResponse } from '../models/CreateOrderUserCommandResponse';
import { UpdateOrderUserCommand } from '../models/UpdateOrderUserCommand';
import { UpdateOrderUserCommandResponse } from '../models/UpdateOrderUserCommandResponse';
import { GetOrderUserDetailQueryResponse } from '../models/GetOrderUserDetailQueryResponse';
import { DeleteOrderUserCommandResponse } from '../models/DeleteOrderUserCommandResponse';
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class OrderUserService {
    /**
     * @param version
     * @returns GetOrderUserListQueryResponse Success
     * @throws ApiError
     */
    public static orderUserGet(
        version: string,
    ): CancelablePromise<GetOrderUserListQueryResponse> {
        return __request(OpenAPI, {
            method: "GET",
            url: "/api/v{version}/OrderUser",
            path: {
                version: version,
            },
        });
    }

    /**
     * @param version
     * @param requestBody
     * @returns CreateOrderUserCommandResponse Success
     * @throws ApiError
     */
    public static orderUserPost(
        version: string,
        requestBody?: CreateOrderUserCommand,
    ): CancelablePromise<CreateOrderUserCommandResponse> {
        return __request(OpenAPI, {
            method: "POST",
            url: "/api/v{version}/OrderUser",
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
     * @returns UpdateOrderUserCommandResponse Success
     * @throws ApiError
     */
    public static orderUserPut(
        version: string,
        requestBody?: UpdateOrderUserCommand,
    ): CancelablePromise<UpdateOrderUserCommandResponse> {
        return __request(OpenAPI, {
            method: "PUT",
            url: "/api/v{version}/OrderUser",
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
     * @returns GetOrderUserDetailQueryResponse Success
     * @throws ApiError
     */
    public static getOrderUserById(
        id: string,
        version: string,
    ): CancelablePromise<GetOrderUserDetailQueryResponse> {
        return __request(OpenAPI, {
            method: "GET",
            url: "/api/v{version}/OrderUser/{id}",
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
     * @returns DeleteOrderUserCommandResponse Success
     * @throws ApiError
     */
    public static deleteOrderUser(
        id: string,
        version: string,
    ): CancelablePromise<DeleteOrderUserCommandResponse> {
        return __request(OpenAPI, {
            method: "DELETE",
            url: "/api/v{version}/OrderUser/{id}",
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
