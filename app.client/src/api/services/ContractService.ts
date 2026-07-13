/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateContractCommand } from "../models/CreateContractCommand";
import type { CreateContractCommandResponse } from "../models/CreateContractCommandResponse";
import type { DeleteContractCommandResponse } from "../models/DeleteContractCommandResponse";
import type { GetContractDetailQueryResponse } from "../models/GetContractDetailQueryResponse";
import type { GetContractListQueryResponse } from "../models/GetContractListQueryResponse";
import type { ProblemDetails } from "../models/ProblemDetails";
import type { UpdateContractCommand } from "../models/UpdateContractCommand";
import type { UpdateContractCommandResponse } from "../models/UpdateContractCommandResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ContractService {
  /**
   * @param version
   * @returns GetContractListQueryResponse OK
   * @throws ApiError
   */
  public static getApiVContract(
    version: string
  ): CancelablePromise<GetContractListQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/Contract",
      path: {
        version: version,
      },
    });
  }
  /**
   * @param version
   * @param requestBody
   * @returns CreateContractCommandResponse OK
   * @throws ApiError
   */
  public static postApiVContract(
    version: string,
    requestBody?: CreateContractCommand
  ): CancelablePromise<CreateContractCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/Contract",
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
   * @returns UpdateContractCommandResponse OK
   * @throws ApiError
   */
  public static putApiVContract(
    version: string,
    requestBody?: UpdateContractCommand
  ): CancelablePromise<UpdateContractCommandResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v{version}/Contract",
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
   * @returns GetContractDetailQueryResponse OK
   * @throws ApiError
   */
  public static getContractById(
    id: string,
    version: string
  ): CancelablePromise<GetContractDetailQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/Contract/{id}",
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
   * @returns DeleteContractCommandResponse OK
   * @returns ProblemDetails Error
   * @throws ApiError
   */
  public static deleteContract(
    id: string,
    version: string
  ): CancelablePromise<DeleteContractCommandResponse | ProblemDetails> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v{version}/Contract/{id}",
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
