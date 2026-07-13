/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCompanyCalendarHolidayCommand } from "../models/CreateCompanyCalendarHolidayCommand";
import type { CreateCompanyCalendarHolidayCommandResponse } from "../models/CreateCompanyCalendarHolidayCommandResponse";
import type { DeleteCompanyCalendarHolidayCommandResponse } from "../models/DeleteCompanyCalendarHolidayCommandResponse";
import type { GetCompanyCalendarHolidayDetailQueryResponse } from "../models/GetCompanyCalendarHolidayDetailQueryResponse";
import type { GetCompanyCalendarHolidayListQueryResponse } from "../models/GetCompanyCalendarHolidayListQueryResponse";
import type { ProblemDetails } from "../../../api-new/models/ProblemDetails";
import type { UpdateCompanyCalendarHolidayCommand } from "../models/UpdateCompanyCalendarHolidayCommand";
import type { UpdateCompanyCalendarHolidayCommandResponse } from "../models/UpdateCompanyCalendarHolidayCommandResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class CompanyCalendarHolidayService {
  /**
   * @param version
   * @returns GetCompanyCalendarHolidayListQueryResponse OK
   * @throws ApiError
   */
  public static getApiVCompanyCalendarHoliday(
    version: string
  ): CancelablePromise<GetCompanyCalendarHolidayListQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/CompanyCalendarHoliday",
      path: {
        version: version,
      },
    });
  }
  /**
   * @param version
   * @param requestBody
   * @returns CreateCompanyCalendarHolidayCommandResponse OK
   * @throws ApiError
   */
  public static postApiVCompanyCalendarHoliday(
    version: string,
    requestBody?: CreateCompanyCalendarHolidayCommand
  ): CancelablePromise<CreateCompanyCalendarHolidayCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/CompanyCalendarHoliday",
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
   * @returns UpdateCompanyCalendarHolidayCommandResponse OK
   * @throws ApiError
   */
  public static putApiVCompanyCalendarHoliday(
    version: string,
    requestBody?: UpdateCompanyCalendarHolidayCommand
  ): CancelablePromise<UpdateCompanyCalendarHolidayCommandResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v{version}/CompanyCalendarHoliday",
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
   * @returns GetCompanyCalendarHolidayDetailQueryResponse OK
   * @throws ApiError
   */
  public static getCompanyCalendarHolidayById(
    id: string,
    version: string
  ): CancelablePromise<GetCompanyCalendarHolidayDetailQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/CompanyCalendarHoliday/{id}",
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
   * @returns DeleteCompanyCalendarHolidayCommandResponse OK
   * @returns ProblemDetails Error
   * @throws ApiError
   */
  public static deleteCompanyCalendarHoliday(
    id: string,
    version: string
  ): CancelablePromise<
    DeleteCompanyCalendarHolidayCommandResponse | ProblemDetails
  > {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v{version}/CompanyCalendarHoliday/{id}",
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
