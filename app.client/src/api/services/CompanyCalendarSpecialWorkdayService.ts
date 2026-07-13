/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCompanyCalendarSpecialWorkdayCommand } from "../models/CreateCompanyCalendarSpecialWorkdayCommand";
import type { CreateCompanyCalendarSpecialWorkdayCommandResponse } from "../models/CreateCompanyCalendarSpecialWorkdayCommandResponse";
import type { DeleteCompanyCalendarSpecialWorkdayCommandResponse } from "../models/DeleteCompanyCalendarSpecialWorkdayCommandResponse";
import type { GetCompanyCalendarSpecialWorkdayDetailQueryResponse } from "../models/GetCompanyCalendarSpecialWorkdayDetailQueryResponse";
import type { GetCompanyCalendarSpecialWorkdayListQueryResponse } from "../models/GetCompanyCalendarSpecialWorkdayListQueryResponse";
import type { ProblemDetails } from "../../../api-new/models/ProblemDetails";
import type { UpdateCompanyCalendarSpecialWorkdayCommand } from "../models/UpdateCompanyCalendarSpecialWorkdayCommand";
import type { UpdateCompanyCalendarSpecialWorkdayCommandResponse } from "../models/UpdateCompanyCalendarSpecialWorkdayCommandResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class CompanyCalendarSpecialWorkdayService {
  /**
   * @param version
   * @returns GetCompanyCalendarSpecialWorkdayListQueryResponse OK
   * @throws ApiError
   */
  public static getApiVCompanyCalendarSpecialWorkday(
    version: string
  ): CancelablePromise<GetCompanyCalendarSpecialWorkdayListQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/CompanyCalendarSpecialWorkday",
      path: {
        version: version,
      },
    });
  }
  /**
   * @param version
   * @param requestBody
   * @returns CreateCompanyCalendarSpecialWorkdayCommandResponse OK
   * @throws ApiError
   */
  public static postApiVCompanyCalendarSpecialWorkday(
    version: string,
    requestBody?: CreateCompanyCalendarSpecialWorkdayCommand
  ): CancelablePromise<CreateCompanyCalendarSpecialWorkdayCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/CompanyCalendarSpecialWorkday",
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
   * @returns UpdateCompanyCalendarSpecialWorkdayCommandResponse OK
   * @throws ApiError
   */
  public static putApiVCompanyCalendarSpecialWorkday(
    version: string,
    requestBody?: UpdateCompanyCalendarSpecialWorkdayCommand
  ): CancelablePromise<UpdateCompanyCalendarSpecialWorkdayCommandResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v{version}/CompanyCalendarSpecialWorkday",
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
   * @returns GetCompanyCalendarSpecialWorkdayDetailQueryResponse OK
   * @throws ApiError
   */
  public static getCompanyCalendarSpecialWorkdayById(
    id: string,
    version: string
  ): CancelablePromise<GetCompanyCalendarSpecialWorkdayDetailQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/CompanyCalendarSpecialWorkday/{id}",
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
   * @returns DeleteCompanyCalendarSpecialWorkdayCommandResponse OK
   * @returns ProblemDetails Error
   * @throws ApiError
   */
  public static deleteCompanyCalendarSpecialWorkday(
    id: string,
    version: string
  ): CancelablePromise<
    DeleteCompanyCalendarSpecialWorkdayCommandResponse | ProblemDetails
  > {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v{version}/CompanyCalendarSpecialWorkday/{id}",
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
