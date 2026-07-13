/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCompanySiteCommand } from "../models/CreateCompanySiteCommand";
import type { CreateCompanySiteCommandResponse } from "../models/CreateCompanySiteCommandResponse";
import type { DeleteCompanySiteCommandResponse } from "../models/DeleteCompanySiteCommandResponse";
import type { GetCompanySiteDetailQueryResponse } from "../models/GetCompanySiteDetailQueryResponse";
import type { GetCompanySiteListQueryResponse } from "../models/GetCompanySiteListQueryResponse";
import type { ProblemDetails } from "../models/ProblemDetails";
import type { UpdateCompanySiteCommand } from "../models/UpdateCompanySiteCommand";
import type { UpdateCompanySiteCommandResponse } from "../models/UpdateCompanySiteCommandResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class CompanySiteService {
  /**
   * @param version
   * @returns GetCompanySiteListQueryResponse OK
   * @throws ApiError
   */
  public static getApiVCompanySite(
    version: string
  ): CancelablePromise<GetCompanySiteListQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/CompanySite",
      path: {
        version: version,
      },
    });
  }
  /**
   * @param version
   * @param requestBody
   * @returns CreateCompanySiteCommandResponse OK
   * @throws ApiError
   */
  public static postApiVCompanySite(
    version: string,
    requestBody?: CreateCompanySiteCommand
  ): CancelablePromise<CreateCompanySiteCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/CompanySite",
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
   * @returns UpdateCompanySiteCommandResponse OK
   * @throws ApiError
   */
  public static putApiVCompanySite(
    version: string,
    requestBody?: UpdateCompanySiteCommand
  ): CancelablePromise<UpdateCompanySiteCommandResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v{version}/CompanySite",
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
   * @returns GetCompanySiteDetailQueryResponse OK
   * @throws ApiError
   */
  public static getCompanySiteById(
    id: string,
    version: string
  ): CancelablePromise<GetCompanySiteDetailQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/CompanySite/{id}",
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
   * @returns DeleteCompanySiteCommandResponse OK
   * @returns ProblemDetails Error
   * @throws ApiError
   */
  public static deleteCompanySite(
    id: string,
    version: string
  ): CancelablePromise<DeleteCompanySiteCommandResponse | ProblemDetails> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v{version}/CompanySite/{id}",
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
