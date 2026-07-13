/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateContractMediaUnitCommand } from "../models/CreateContractMediaUnitCommand";
import type { CreateContractMediaUnitCommandResponse } from "../models/CreateContractMediaUnitCommandResponse";
import type { DeleteContractMediaUnitCommandResponse } from "../models/DeleteContractMediaUnitCommandResponse";
import type { GetContractMediaUnitDetailQueryResponse } from "../models/GetContractMediaUnitDetailQueryResponse";
import type { GetContractMediaUnitListQueryResponse } from "../models/GetContractMediaUnitListQueryResponse";
import type { ProblemDetails } from "../models/ProblemDetails";
import type { UpdateContractMediaUnitCommand } from "../models/UpdateContractMediaUnitCommand";
import type { UpdateContractMediaUnitCommandResponse } from "../models/UpdateContractMediaUnitCommandResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ContractMediaUnitService {
  /**
   * @param version
   * @param contractId
   * @returns GetContractMediaUnitListQueryResponse OK
   * @throws ApiError
   */
  public static getApiVContractMediaUnit(
    version: string,
    contractId?: string
  ): CancelablePromise<GetContractMediaUnitListQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/ContractMediaUnit",
      path: {
        version: version,
      },
      query: {
        contractId: contractId,
      },
    });
  }
  /**
   * @param version
   * @param requestBody
   * @returns CreateContractMediaUnitCommandResponse OK
   * @throws ApiError
   */
  public static postApiVContractMediaUnit(
    version: string,
    requestBody?: CreateContractMediaUnitCommand
  ): CancelablePromise<CreateContractMediaUnitCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/ContractMediaUnit",
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
   * @returns UpdateContractMediaUnitCommandResponse OK
   * @throws ApiError
   */
  public static putApiVContractMediaUnit(
    version: string,
    requestBody?: UpdateContractMediaUnitCommand
  ): CancelablePromise<UpdateContractMediaUnitCommandResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v{version}/ContractMediaUnit",
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
   * @returns GetContractMediaUnitDetailQueryResponse OK
   * @throws ApiError
   */
  public static getContractMediaUnitById(
    id: string,
    version: string
  ): CancelablePromise<GetContractMediaUnitDetailQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/ContractMediaUnit/{id}",
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
   * @returns DeleteContractMediaUnitCommandResponse OK
   * @returns ProblemDetails Error
   * @throws ApiError
   */
  public static deleteContractMediaUnit(
    id: string,
    version: string
  ): CancelablePromise<
    DeleteContractMediaUnitCommandResponse | ProblemDetails
  > {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v{version}/ContractMediaUnit/{id}",
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
