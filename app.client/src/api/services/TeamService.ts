import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class TeamService {
  /**
   * List teams
   * @param version API version
   * @returns any Success
   * @throws ApiError
   */
  public static getApiVTeam(
    version: string = "1"
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/Team",
      path: { version },
    });
  }

  /**
   * Get team by ID
   * @param id Team ID
   * @param version API version
   * @returns any Success
   * @throws ApiError
   */
  public static getApiVTeamById(
    id: string,
    version: string = "1"
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/Team/{id}",
      path: { version, id },
    });
  }

  /**
   * Create a new team
   * @param version API version
   * @param requestBody team payload
   * @returns any Success
   * @throws ApiError
   */
  public static postApiVTeam(
    version: string = "1",
    requestBody: any
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/Team",
      path: { version },
      body: requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * Update an existing team
   * @param version API version
   * @param requestBody team payload
   * @returns any Success
   * @throws ApiError
   */
  public static putApiVTeam(
    version: string = "1",
    requestBody: any
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v{version}/Team",
      path: { version },
      body: requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * Delete a team by ID
   * @param id Team ID
   * @param version API version
   * @returns any Success
   * @throws ApiError
   */
  public static deleteApiVTeam(
    id: string,
    version: string = "1"
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v{version}/Team/{id}",
      path: { version, id },
    });
  }
}
