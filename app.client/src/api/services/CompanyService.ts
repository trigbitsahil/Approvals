/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCompanyCommand } from "../models/CreateCompanyCommand";
import type { CreateCompanyCommandResponse } from "../models/CreateCompanyCommandResponse";
import type { DeleteCompanyCommandResponse } from "../models/DeleteCompanyCommandResponse";
import type { GetCompanyDetailQueryResponse } from "../models/GetCompanyDetailQueryResponse";
import type { GetCompanyListQueryResponse } from "../models/GetCompanyListQueryResponse";
import type { ProblemDetails } from "../models/ProblemDetails";
import type { UpdateCompanyCommand } from "../models/UpdateCompanyCommand";
import type { UpdateCompanyCommandResponse } from "../models/UpdateCompanyCommandResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class CompanyService {
  /**
   * @param version
   * @returns GetCompanyListQueryResponse OK
   * @throws ApiError
   */
  public static getApiVCompany(
    version: string
  ): CancelablePromise<GetCompanyListQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/Company",
      path: {
        version: version,
      },
    });
  }
  /**
   * @param version
   * @param requestBody
   * @returns CreateCompanyCommandResponse OK
   * @throws ApiError
   */
  public static postApiVCompany(
    version: string,
    requestBody?: CreateCompanyCommand
  ): CancelablePromise<CreateCompanyCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/Company",
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
   * @returns UpdateCompanyCommandResponse OK
   * @throws ApiError
   */
  public static putApiVCompany(
    version: string,
    requestBody?: UpdateCompanyCommand
  ): CancelablePromise<UpdateCompanyCommandResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v{version}/Company",
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
   * @returns GetCompanyDetailQueryResponse OK
   * @throws ApiError
   */
  public static getCompanyById(
    id: string,
    version: string
  ): CancelablePromise<GetCompanyDetailQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/Company/{id}",
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
   * @returns DeleteCompanyCommandResponse OK
   * @returns ProblemDetails Error
   * @throws ApiError
   */
  public static deleteCompany(
    id: string,
    version: string
  ): CancelablePromise<DeleteCompanyCommandResponse | ProblemDetails> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v{version}/Company/{id}",
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
