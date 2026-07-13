/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
// import type { CreateWarehouseLocationCommand } from "../../src/api/models/CreateWarehouseLocationCommand";
import type { CreateWarehouseLocationCommand } from "../models/CreateWarehouseLocationCommand";

import type { CreateWarehouseLocationCommandResponse } from "../models/CreateWarehouseLocationCommandResponse";
import type { DeleteWarehouseLocationCommandResponse } from "../models/DeleteWarehouseLocationCommandResponse";
import type { GetWarehouseLocationDetailQueryResponse } from "../models/GetWarehouseLocationDetailQueryResponse";
import type { GetWarehouseLocationListQueryResponse } from "../models/GetWarehouseLocationListQueryResponse";
import type { ProblemDetails } from "../models/ProblemDetails";
import type { UpdateWarehouseLocationCommand } from "../models/UpdateWarehouseLocationCommand";
import type { UpdateWarehouseLocationCommandResponse } from "../models/UpdateWarehouseLocationCommandResponse";
import type { GetWarehouseLocationDetailByCodeQueryResponse } from '../models/GetWarehouseLocationDetailByCodeQueryResponse';

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class WarehouseLocationService {
  /**
   * @param version
   * @returns GetWarehouseLocationListQueryResponse Success
   * @throws ApiError
   */
  public static warehouseLocationGet(
    version: string,
  ): CancelablePromise<GetWarehouseLocationListQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/WarehouseLocation",
      path: {
        version: version,
      },
    });
  }
  /**
   * @param version
   * @param requestBody
   * @returns CreateWarehouseLocationCommandResponse Success
   * @throws ApiError
   */
  public static warehouseLocationPost(
    version: string,
    requestBody?: CreateWarehouseLocationCommand,
  ): CancelablePromise<CreateWarehouseLocationCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/WarehouseLocation",
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
   * @returns UpdateWarehouseLocationCommandResponse Success
   * @throws ApiError
   */
  public static warehouseLocationPut(
    version: string,
    requestBody?: UpdateWarehouseLocationCommand,
  ): CancelablePromise<UpdateWarehouseLocationCommandResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v{version}/WarehouseLocation",
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
   * @returns GetWarehouseLocationDetailQueryResponse Success
   * @throws ApiError
   */
  public static getWarehouseLocationById(
    id: string,
    version: string,
  ): CancelablePromise<GetWarehouseLocationDetailQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/WarehouseLocation/{id}",
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
   * @returns DeleteWarehouseLocationCommandResponse Success
   * @returns ProblemDetails Error
   * @throws ApiError
   */
  public static deleteWarehouseLocation(
    id: string,
    version: string,
  ): CancelablePromise<
    DeleteWarehouseLocationCommandResponse | ProblemDetails
  > {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v{version}/WarehouseLocation/{id}",
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
       * @returns GetWarehouseLocationDetailByCodeQueryResponse Success
       * @throws ApiError
       */
  public static getWarehouseLocationByCode(
    version: string,
    code?: string,
  ): CancelablePromise<GetWarehouseLocationDetailByCodeQueryResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v{version}/WarehouseLocation/GetWarehouseLocationByCode',
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
}
