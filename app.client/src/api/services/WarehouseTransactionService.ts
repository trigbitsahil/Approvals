/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateWarehouseTransactionCommand } from '../models/CreateWarehouseTransactionCommand';
import type { CreateWarehouseTransactionCommandResponse } from '../models/CreateWarehouseTransactionCommandResponse';
import type { DeleteWarehouseTransactionCommandResponse } from '../models/DeleteWarehouseTransactionCommandResponse';
import type { GetWarehouseTransactionDetailQueryResponse } from '../models/GetWarehouseTransactionDetailQueryResponse';
import type { GetWarehouseTransactionListQueryResponse } from '../models/GetWarehouseTransactionListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateWarehouseTransactionCommand } from '../models/UpdateWarehouseTransactionCommand';
import type { UpdateWarehouseTransactionCommandResponse } from '../models/UpdateWarehouseTransactionCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { DeleteWarehouseTransactionByLineCommandResponse } from '../models/DeleteWarehouseTransactionByLineCommandResponse';
import type { GetWarehouseTransactionListByLineQueryResponse } from '../models/GetWarehouseTransactionListByLineQueryResponse';
import type { GetWarehouseTransactionHistoryByOrderQueryResponse } from '../models/GetWarehouseTransactionHistoryByOrderQueryResponse';
import type { GetWarehouseTransactionHistoryDetailQueryResponse } from '../models/GetWarehouseTransactionHistoryDetailQueryResponse';
import type { GetWarehouseTransactionHistoryQueryResponse } from '../models/GetWarehouseTransactionHistoryQueryResponse';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WarehouseTransactionService {
    /**
     * @param version
     * @returns GetWarehouseTransactionListQueryResponse Success
     * @throws ApiError
     */
    public static warehouseTransactionGet(
        version: string,
        orderId?: string,
    ): CancelablePromise<GetWarehouseTransactionListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/WarehouseTransaction',
            path: {
                'version': version,
            },
            query: {
                'orderId': orderId,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateWarehouseTransactionCommandResponse Success
     * @throws ApiError
     */
    public static warehouseTransactionPost(
        version: string,
        requestBody?: CreateWarehouseTransactionCommand,
    ): CancelablePromise<CreateWarehouseTransactionCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/WarehouseTransaction',
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
     * @returns UpdateWarehouseTransactionCommandResponse Success
     * @throws ApiError
     */
    public static warehouseTransactionPut(
        version: string,
        requestBody?: UpdateWarehouseTransactionCommand,
    ): CancelablePromise<UpdateWarehouseTransactionCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/WarehouseTransaction',
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
     * @returns GetWarehouseTransactionDetailQueryResponse Success
     * @throws ApiError
     */
    public static getWarehouseTransactionById(
        id: string,
        version: string,
    ): CancelablePromise<GetWarehouseTransactionDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/WarehouseTransaction/{id}',
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
     * @returns DeleteWarehouseTransactionCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteWarehouseTransaction(
        id: string,
        version: string,
        orderId?: string,
    ): CancelablePromise<DeleteWarehouseTransactionCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/WarehouseTransaction/{id}',
            path: {
                'id': id,
                'version': version,
            },
            query: {
                'orderid': orderId,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
         * @param version
         * @param lineId
         * @returns DeleteWarehouseTransactionByLineCommandResponse Success
         * @returns ProblemDetails Error
         * @throws ApiError
         */
    public static deleteWarehouseTransactionByLine(
        version: string,
        lineId?: string,
    ): CancelablePromise<DeleteWarehouseTransactionByLineCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/WarehouseTransaction/DeleteWarehouseTransactionByLine',
            path: {
                'version': version,
            },
            query: {
                'lineid': lineId,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param version
     * @param lineId
     * @returns GetWarehouseTransactionListByLineQueryResponse Success
     * @throws ApiError
     */
    public static getWarehouseTransactionListByLine(
        version: string,
        lineId?: string,
    ): CancelablePromise<GetWarehouseTransactionListByLineQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/WarehouseTransaction/GetWarehouseTransactionListByLine',
            path: {
                'version': version,
            },
            query: {
                'lineid': lineId,
            },
        });
    }

    /**
        * @param version
        * @param userEmail
        * @returns GetWarehouseTransactionHistoryQueryResponse Success
        * @throws ApiError
        */
    public static getWarehouseTransactionHistory(
        version: string,
        userEmail?: string,
    ): CancelablePromise<GetWarehouseTransactionHistoryQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/WarehouseTransaction/GetWarehouseTransactionHistory',
            path: {
                'version': version,
            },
            query: {
                'userEmail': userEmail,
            },
        });
    }
    /**
     * @param version
     * @param code
     * @returns GetWarehouseTransactionHistoryDetailQueryResponse Success
     * @throws ApiError
     */
    public static getWarehouseTransactionHistoryDetail(
        version: string,
        code?: string,
    ): CancelablePromise<GetWarehouseTransactionHistoryDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/WarehouseTransaction/GetWarehouseTransactionHistoryDetail',
            path: {
                'version': version,
            },
            query: {
                'code': code,
            },
        });
    }
    /**
     * @param version
     * @param code
     * @param orderId
     * @returns GetWarehouseTransactionHistoryByOrderQueryResponse Success
     * @throws ApiError
     */
    public static getWarehouseTransactionHistoryByOrder(
        version: string,
        code?: string,
        orderId?: string,
    ): CancelablePromise<GetWarehouseTransactionHistoryByOrderQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/WarehouseTransaction/GetWarehouseTransactionHistoryByOrder',
            path: {
                'version': version,
            },
            query: {
                'code': code,
                'orderId': orderId,
            },
        });
    }
}
