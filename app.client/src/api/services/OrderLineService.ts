/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { GetOrderLineListQueryResponse } from "../models/GetOrderLineListQueryResponse";
import { CreateOrderLineCommand } from "../models/CreateOrderLineCommand";
import { CreateOrderLineCommandResponse } from "../models/CreateOrderLineCommandResponse";
import { UpdateOrderLineCommand } from "../models/UpdateOrderLineCommand";
import { UpdateOrderLineCommandResponse } from "../models/UpdateOrderLineCommandResponse";
import { GetOrderLineDetailQueryResponse } from "../models/GetOrderLineDetailQueryResponse";
import { DeleteOrderLineCommandResponse } from "../models/DeleteOrderLineCommandResponse";
import type { GetOrderLineListByOrderQueryResponse } from '../models/GetOrderLineListByOrderQueryResponse';

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class OrderLineService {
  /**
   * @param version
   * @returns GetOrderLineListQueryResponse Success
   * @throws ApiError
   */
  public static orderLineGet(
    version: string,
  ): CancelablePromise<GetOrderLineListQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/OrderLine",
      path: {
        version: version,
      },
    });
  }

  /**
   * @param version
   * @param requestBody
   * @returns CreateOrderLineCommandResponse Success
   * @throws ApiError
   */
  public static orderLinePost(
    version: string,
    requestBody?: CreateOrderLineCommand,
  ): CancelablePromise<CreateOrderLineCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/OrderLine",
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
   * @returns UpdateOrderLineCommandResponse Success
   * @throws ApiError
   */
  public static orderLinePut(
    version: string,
    requestBody?: UpdateOrderLineCommand,
  ): CancelablePromise<UpdateOrderLineCommandResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v{version}/OrderLine",
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
   * @returns GetOrderLineDetailQueryResponse Success
   * @throws ApiError
   */
  public static getOrderLineById(
    id: string,
    version: string,
  ): CancelablePromise<GetOrderLineDetailQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/OrderLine/{id}",
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
   * @returns DeleteOrderLineCommandResponse Success
   * @throws ApiError
   */
  public static deleteOrderLine(
    id: string,
    version: string,
  ): CancelablePromise<DeleteOrderLineCommandResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v{version}/OrderLine/{id}",
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
      * @param orderId
      * @returns GetOrderLineListByOrderQueryResponse Success
      * @throws ApiError
      */
  public static getOrderLinesByOrder(
    version: string,
    orderId?: string,
  ): CancelablePromise<GetOrderLineListByOrderQueryResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v{version}/OrderLine/GetOrderLinesByOrder',
      path: {
        'version': version,
      },
      query: {
        'orderId': orderId,
      },
    });
  }
}
