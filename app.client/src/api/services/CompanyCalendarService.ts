/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCompanyCalendarCommand } from "../models/CreateCompanyCalendarCommand";
import type { CreateCompanyCalendarCommandResponse } from "../models/CreateCompanyCalendarCommandResponse";
import type { DeleteCompanyCalendarCommandResponse } from "../models/DeleteCompanyCalendarCommandResponse";
import type { GetCompanyCalendarDetailQueryResponse } from "../models/GetCompanyCalendarDetailQueryResponse";
import type { GetCompanyCalendarListQueryResponse } from "../models/GetCompanyCalendarListQueryResponse";
import type { ProblemDetails } from "../../../api-new/models/ProblemDetails";
import type { UpdateCompanyCalendarCommand } from "../models/UpdateCompanyCalendarCommand";
import type { UpdateCompanyCalendarCommandResponse } from "../models/UpdateCompanyCalendarCommandResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class CompanyCalendarService {
  /**
   * @param version
   * @returns GetCompanyCalendarListQueryResponse OK
   * @throws ApiError
   */
  public static getApiVCompanyCalendar(
    version: string
  ): CancelablePromise<GetCompanyCalendarListQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/CompanyCalendar",
      path: {
        version: version,
      },
    });
  }
  /**
   * @param version
   * @param requestBody
   * @returns CreateCompanyCalendarCommandResponse OK
   * @throws ApiError
   */
  public static postApiVCompanyCalendar(
    version: string,
    requestBody?: CreateCompanyCalendarCommand
  ): CancelablePromise<CreateCompanyCalendarCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/CompanyCalendar",
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
   * @returns UpdateCompanyCalendarCommandResponse OK
   * @throws ApiError
   */
  public static putApiVCompanyCalendar(
    version: string,
    requestBody?: UpdateCompanyCalendarCommand
  ): CancelablePromise<UpdateCompanyCalendarCommandResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v{version}/CompanyCalendar",
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
   * @returns GetCompanyCalendarDetailQueryResponse OK
   * @throws ApiError
   */
  public static getCompanyCalendarById(
    id: string,
    version: string
  ): CancelablePromise<GetCompanyCalendarDetailQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/CompanyCalendar/{id}",
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
   * @returns DeleteCompanyCalendarCommandResponse OK
   * @returns ProblemDetails Error
   * @throws ApiError
   */
  public static deleteCompanyCalendar(
    id: string,
    version: string
  ): CancelablePromise<DeleteCompanyCalendarCommandResponse | ProblemDetails> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v{version}/CompanyCalendar/{id}",
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
