/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateWarehouseCommand } from "../models/CreateWarehouseCommand";
import type { CreateWarehouseCommandResponse } from "../models/CreateWarehouseCommandResponse";
import type { DeleteWarehouseCommandResponse } from "../models/DeleteWarehouseCommandResponse";
import type { GetWarehouseDetailQueryResponse } from "../models/GetWarehouseDetailQueryResponse";
import type { GetWarehouseListQueryResponse } from "../models/GetWarehouseListQueryResponse";
import type { ProblemDetails } from "../models/ProblemDetails";
import type { UpdateWarehouseCommand } from "../models/UpdateWarehouseCommand";
import type { UpdateWarehouseCommandResponse } from "../models/UpdateWarehouseCommandResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class WarehouseService {
  /**
   * @param version
   * @returns GetWarehouseListQueryResponse Success
   * @throws ApiError
   */
  public static warehouseGet(
    version: string,
  ): CancelablePromise<GetWarehouseListQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/Warehouse",
      path: {
        version: version,
      },
    });
  }
  /**
   * @param version
   * @param requestBody
   * @returns CreateWarehouseCommandResponse Success
   * @throws ApiError
   */
  public static warehousePost(
    version: string,
    requestBody?: CreateWarehouseCommand,
  ): CancelablePromise<CreateWarehouseCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/Warehouse",
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
   * @returns UpdateWarehouseCommandResponse Success
   * @throws ApiError
   */
  public static warehousePut(
    version: string,
    requestBody?: UpdateWarehouseCommand,
  ): CancelablePromise<UpdateWarehouseCommandResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v{version}/Warehouse",
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
   * @returns GetWarehouseDetailQueryResponse Success
   * @throws ApiError
   */
  public static getWarehouseById(
    id: string,
    version: string,
  ): CancelablePromise<GetWarehouseDetailQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/Warehouse/{id}",
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
   * @returns DeleteWarehouseCommandResponse Success
   * @returns ProblemDetails Error
   * @throws ApiError
   */
  public static deleteWarehouse(
    id: string,
    version: string,
  ): CancelablePromise<DeleteWarehouseCommandResponse | ProblemDetails> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v{version}/Warehouse/{id}",
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
