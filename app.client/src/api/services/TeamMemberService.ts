import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class TeamMemberService {
  /**
   * List team members
   * @param category Category name (e.g. "team")
   * @param categoryId Category ID (e.g. teamId)
   * @param version API version
   * @returns any Success
   * @throws ApiError
   */
  public static getApiVTeamMember(
    category: string,
    categoryId: string,
    version: string = "1"
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/TeamMember",
      path: { version },
      query: { category, categoryId },
    });
  }

  /**
   * Get team members by Team ID
   * @param teamId Team ID
   * @param version API version
   * @returns any Success
   */
  public static getMembersByTeamId(
    teamId: string,
    version: string = "1"
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/TeamMember/GetTeamMembersByTeamId",
      path: { version },
      query: { teamId },
    });
  }




  /**
   * Get team member by ID
   * @param id TeamMember ID
   * @param version API version
   * @returns any Success
   * @throws ApiError
   */
  public static getApiVTeamMemberById(
    id: string,
    version: string = "1"
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/TeamMember/{id}",
      path: { version, id },
    });
  }

  /**
   * Create a new team member
   * @param version API version
   * @param requestBody team member payload
   * @returns any Success
   * @throws ApiError
   */
  public static postApiVTeamMember(
    version: string = "1",
    requestBody: any
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/TeamMember",
      path: { version },
      body: requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * Update an existing team member
   * @param version API version
   * @param requestBody team member payload
   * @returns any Success
   * @throws ApiError
   */
  public static putApiVTeamMember(
    version: string = "1",
    requestBody: any
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v{version}/TeamMember",
      path: { version },
      body: requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * Delete a team member by ID
   * @param id TeamMember ID
   * @param version API version
   * @returns any Success
   * @throws ApiError
   */
  public static deleteApiVTeamMember(
    id: string,
    version: string = "1"
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v{version}/TeamMember/{id}",
      path: { version, id },
    });
  }
}
