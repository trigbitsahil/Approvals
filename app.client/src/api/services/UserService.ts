/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChangePasswordCommand } from "../models/ChangePasswordCommand";
import type { ChangeUserPasswordCommand } from "../models/ChangeUserPasswordCommand";
import type { CreateRoleCommand } from "../models/CreateRoleCommand";
import type { CreateUserCommand } from "../models/CreateUserCommand";
import type { CreateUserCommandResponse } from "../models/CreateUserCommandResponse";
import type { DeleteUserCommandResponse } from "../models/DeleteUserCommandResponse";
import type { ForgotPasswordCommand } from "../models/ForgotPasswordCommand";
import type { GetUserActivityQueryResponse } from "../models/GetUserActivityQueryResponse";
import type { GetUserDetailQueryResponse } from "../models/GetUserDetailQueryResponse";
import type { GetUserListQueryResponse } from "../models/GetUserListQueryResponse";
import type { GetUserRolesCommandResponse } from "../models/GetUserRolesCommandResponse";
import type { ProblemDetails } from "../models/ProblemDetails";
import type { ResetPasswordCommand } from "../models/ResetPasswordCommand";
import type { UpdateUserCommand } from "../models/UpdateUserCommand";
import type { UpdateUserCommandResponse } from "../models/UpdateUserCommandResponse";
import type { UserRolesDto } from "../models/UserRolesDto";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class UserService {
  /**
   * @param version
   * @returns GetUserListQueryResponse OK
   * @throws ApiError
   */
  public static getApiVUser(
    version: string
  ): CancelablePromise<GetUserListQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/User",
      path: {
        version: version,
      },
    });
  }
  /**
   * @param version
   * @param requestBody
   * @returns CreateUserCommandResponse OK
   * @throws ApiError
   */
  public static postApiVUser(
    version: string,
    requestBody?: CreateUserCommand
  ): CancelablePromise<CreateUserCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/User",
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
   * @returns UpdateUserCommandResponse OK
   * @throws ApiError
   */
  public static putApiVUser(
    version: string,
    requestBody?: UpdateUserCommand
  ): CancelablePromise<UpdateUserCommandResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v{version}/User",
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
   * @returns GetUserDetailQueryResponse OK
   * @throws ApiError
   */
  public static getUserById(
    id: string,
    version: string
  ): CancelablePromise<GetUserDetailQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/User/{id}",
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
   * @returns DeleteUserCommandResponse OK
   * @returns ProblemDetails Error
   * @throws ApiError
   */
  public static deleteUser(
    id: string,
    version: string
  ): CancelablePromise<DeleteUserCommandResponse | ProblemDetails> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v{version}/User/{id}",
      path: {
        id: id,
        version: version,
      },
      errors: {
        400: `Bad Request`,
      },
    });
  }
  /**
   * @param version
   * @returns GetUserDetailQueryResponse OK
   * @throws ApiError
   */
  public static getLoggedInUser(
    version: string
  ): CancelablePromise<GetUserDetailQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/User/GetLoggedInUser",
      path: {
        version: version,
      },
      
      errors: {
        404: `Not Found`,
      },
    });
  }
  /**
   * @param version
   * @param id
   * @returns UpdateUserCommandResponse OK
   * @throws ApiError
   */
  public static setActiveInactive(
    version: string,
    id?: string
  ): CancelablePromise<UpdateUserCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/User/SetActiveInactive",
      path: {
        version: version,
      },
      query: {
        id: id,
      },
      errors: {
        400: `Bad Request`,
      },
    });
  }
  /**
   * @param version
   * @param requestBody
   * @returns DeleteUserCommandResponse OK
   * @throws ApiError
   */
  public static forgotPassword(
    version: string,
    requestBody?: ForgotPasswordCommand
  ): CancelablePromise<DeleteUserCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/User/ForgotPassword",
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
   * @returns DeleteUserCommandResponse OK
   * @throws ApiError
   */
  public static resetPassword(
    version: string,
    requestBody?: ResetPasswordCommand
  ): CancelablePromise<DeleteUserCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/User/ResetPassword",
      path: {
        version: version,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
      },
    });
  }
  /**
   * @param version
   * @param requestBody
   * @returns DeleteUserCommandResponse OK
   * @throws ApiError
   */
  public static changePassword(
    version: string,
    requestBody?: ChangePasswordCommand
  ): CancelablePromise<DeleteUserCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/User/ChangePassword",
      path: {
        version: version,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
      },
    });
  }
  /**
   * @param version
   * @param requestBody
   * @returns DeleteUserCommandResponse OK
   * @throws ApiError
   */
  public static changeUserPassword(
    version: string,
    requestBody?: ChangeUserPasswordCommand
  ): CancelablePromise<DeleteUserCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/User/ChangeUserPassword",
      path: {
        version: version,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
      },
    });
  }
  /**
   * @param version
   * @param requestBody
   * @returns DeleteUserCommandResponse OK
   * @throws ApiError
   */
  public static addUserToRoles(
    version: string,
    requestBody?: UserRolesDto
  ): CancelablePromise<DeleteUserCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/User/AddUserToRoles",
      path: {
        version: version,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
      },
    });
  }
  /**
   * @param version
   * @param requestBody
   * @returns DeleteUserCommandResponse OK
   * @throws ApiError
   */
  public static removeUserFromRoles(
    version: string,
    requestBody?: UserRolesDto
  ): CancelablePromise<DeleteUserCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/User/RemoveUserFromRoles",
      path: {
        version: version,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
      },
    });
  }
  /**
   * @param version
   * @param requestBody
   * @returns DeleteUserCommandResponse OK
   * @throws ApiError
   */
  public static createRole(
    version: string,
    requestBody?: CreateRoleCommand
  ): CancelablePromise<DeleteUserCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/User/CreateRole",
      path: {
        version: version,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
      },
    });
  }
  /**
   * @param version
   * @param id
   * @returns GetUserRolesCommandResponse OK
   * @throws ApiError
   */
  public static getUserRoles(
    version: string,
    id?: string
  ): CancelablePromise<GetUserRolesCommandResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/User/GetUserRoles",
      path: {
        version: version,
      },
      query: {
        id: id,
      },
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
      },
    });
  }
  /**
   * @param version
   * @returns GetUserRolesCommandResponse OK
   * @throws ApiError
   */
  public static getMyRoles(
    version: string
  ): CancelablePromise<GetUserRolesCommandResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/User/GetMyRoles",
      path: {
        version: version,
      },
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
      },
    });
  }
  /**
   * @param version
   * @param requestBody
   * @returns DeleteUserCommandResponse OK
   * @throws ApiError
   */
  public static isUserInRoles(
    version: string,
    requestBody?: UserRolesDto
  ): CancelablePromise<DeleteUserCommandResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/User/IsUserInRoles",
      path: {
        version: version,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
      },
    });
  }
  /**
   * @param version
   * @returns GetUserRolesCommandResponse OK
   * @throws ApiError
   */
  public static getAllRoles(
    version: string
  ): CancelablePromise<GetUserRolesCommandResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/User/GetAllRoles",
      path: {
        version: version,
      },
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
      },
    });
  }
  /**
   * @param version
   * @param id
   * @returns GetUserActivityQueryResponse OK
   * @throws ApiError
   */
  public static getUserActivity(
    version: string,
    id?: string
  ): CancelablePromise<GetUserActivityQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/User/GetUserActivity",
      path: {
        version: version,
      },
      query: {
        id: id,
      },
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
      },
    });
  }
}
