/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCompanyCalendarWorkingDayCommand } from "../models/CreateCompanyCalendarWorkingDayCommand";
import type { CreateCompanyCalendarWorkingDayCommandResponse } from "../models/CreateCompanyCalendarWorkingDayCommandResponse";
import type { DeleteCompanyCalendarWorkingDayCommandResponse } from "../models/DeleteCompanyCalendarWorkingDayCommandResponse";
import type { GetCompanyCalendarWorkingDayDetailQueryResponse } from "../models/GetCompanyCalendarWorkingDayDetailQueryResponse";
import type { GetCompanyCalendarWorkingDayListQueryResponse } from "../models/GetCompanyCalendarWorkingDayListQueryResponse";
import type { ProblemDetails } from "../../../api-new/models/ProblemDetails";
import type { UpdateCompanyCalendarWorkingDayCommand } from "../models/UpdateCompanyCalendarWorkingDayCommand";
import type { UpdateCompanyCalendarWorkingDayCommandResponse } from "../models/UpdateCompanyCalendarWorkingDayCommandResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class CompanyCalendarWorkingDayService {
  /**
   * @param version
   * @returns GetCompanyCalendarWorkingDayListQueryResponse OK
   * @throws ApiError
   */
  public static getApiVCompanyCalendarWorkingDay(
    version: string
  ): CancelablePromise<GetCompanyCalendarWorkingDayListQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/CompanyCalendarWorkingDay",
      path: {
        version: version,
      },
    });
  }
  /**
   * @param version
   * @param requestBody
   * @returns CreateCompanyCalendarWorkingDayCommandResponse OK
   * @throws ApiError
   */
  public static postApiVCompanyCalendarWorkingDay(
    version: string,
    requestBody?: CreateCompanyCalendarWorkingDayCommand
  ): CancelablePromise<CreateCompanyCalendarWorkingDayCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/CompanyCalendarWorkingDay",
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
   * @returns UpdateCompanyCalendarWorkingDayCommandResponse OK
   * @throws ApiError
   */
  public static putApiVCompanyCalendarWorkingDay(
    version: string,
    requestBody?: UpdateCompanyCalendarWorkingDayCommand
  ): CancelablePromise<UpdateCompanyCalendarWorkingDayCommandResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v{version}/CompanyCalendarWorkingDay",
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
   * @returns GetCompanyCalendarWorkingDayDetailQueryResponse OK
   * @throws ApiError
   */
  public static getCompanyCalendarWorkingDayById(
    id: string,
    version: string
  ): CancelablePromise<GetCompanyCalendarWorkingDayDetailQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/CompanyCalendarWorkingDay/{id}",
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
   * @returns DeleteCompanyCalendarWorkingDayCommandResponse OK
   * @returns ProblemDetails Error
   * @throws ApiError
   */
  public static deleteCompanyCalendarWorkingDay(
    id: string,
    version: string
  ): CancelablePromise<
    DeleteCompanyCalendarWorkingDayCommandResponse | ProblemDetails
  > {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v{version}/CompanyCalendarWorkingDay/{id}",
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
