/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateContractMediaCommand } from "../models/CreateContractMediaCommand";
import type { CreateContractMediaCommandResponse } from "../models/CreateContractMediaCommandResponse";
import type { DeleteContractMediaCommandResponse } from "../models/DeleteContractMediaCommandResponse";
import type { GetContractMediaDetailQueryResponse } from "../models/GetContractMediaDetailQueryResponse";
import type { GetContractMediaListQueryResponse } from "../models/GetContractMediaListQueryResponse";
import type { ProblemDetails } from "../models/ProblemDetails";
import type { UpdateContractMediaCommand } from "../models/UpdateContractMediaCommand";
import type { UpdateContractMediaCommandResponse } from "../models/UpdateContractMediaCommandResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ContractMediaService {
  /**
   * @param version
   * @param contractId
   * @returns GetContractMediaListQueryResponse OK
   * @throws ApiError
   */
  public static getApiVContractMedia(
    version: string,
    contractId?: string
  ): CancelablePromise<GetContractMediaListQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/ContractMedia",
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
   * @returns CreateContractMediaCommandResponse OK
   * @throws ApiError
   */
  public static postApiVContractMedia(
    version: string,
    requestBody?: CreateContractMediaCommand
  ): CancelablePromise<CreateContractMediaCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/ContractMedia",
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
   * @returns UpdateContractMediaCommandResponse OK
   * @throws ApiError
   */
  public static putApiVContractMedia(
    version: string,
    requestBody?: UpdateContractMediaCommand
  ): CancelablePromise<UpdateContractMediaCommandResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v{version}/ContractMedia",
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
   * @returns GetContractMediaDetailQueryResponse OK
   * @throws ApiError
   */
  public static getContractMediaById(
    id: string,
    version: string
  ): CancelablePromise<GetContractMediaDetailQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/ContractMedia/{id}",
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
   * @returns DeleteContractMediaCommandResponse OK
   * @returns ProblemDetails Error
   * @throws ApiError
   */
  public static deleteContractMedia(
    id: string,
    version: string
  ): CancelablePromise<DeleteContractMediaCommandResponse | ProblemDetails> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v{version}/ContractMedia/{id}",
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
