/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DepartmentListResponse } from "../models/DepartmentListResponse";
import type { CreateDepartmentCommand } from "../models/CreateDepartmentCommand";
import type { CreateDepartmentCommandResponse } from "../models/CreateDepartmentCommandResponse";
import type { UpdateDepartmentCommand } from "../models/UpdateDepartmentCommand";
import type { UpdateDepartmentCommandResponse } from "../models/UpdateDepartmentCommandResponse";
import type { DeleteDepartmentCommandResponse } from "../models/DeleteDepartmentCommandResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class DepartmentService {
  /**
   * List departments
   * @param version API version
   * @returns DepartmentListResponse Success
   * @throws ApiError
   */
  public static getApiVDepartment(
    version: string
  ): CancelablePromise<DepartmentListResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/department",
      path: { version },
    });
  }

  /**
   * Create a new department
   * @param version API version
   * @param requestBody department payload
   * @returns CreateDepartmentCommandResponse Success
   * @throws ApiError
   */
  public static postApiVDepartment(
    version: string,
    requestBody: CreateDepartmentCommand
  ): CancelablePromise<CreateDepartmentCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/department",
      path: { version },
      body: requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * Update an existing department
   * @param version API version
   * @param requestBody department payload (must include departmentID)
   * @returns UpdateDepartmentCommandResponse Success
   * @throws ApiError
   */
  public static putApiVDepartment(
    version: string,
    requestBody: UpdateDepartmentCommand
  ): CancelablePromise<UpdateDepartmentCommandResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v{version}/department",
      path: { version },
      body: requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * Delete a department by ID
   * @param id Department ID
   * @param version API version
   * @returns DeleteDepartmentCommandResponse Success
   * @throws ApiError
   */
  public static deleteApiVDepartment(
    id: string,
    version: string
  ): CancelablePromise<DeleteDepartmentCommandResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v{version}/department/{id}",
      path: { version, id },
    });
  }
}
