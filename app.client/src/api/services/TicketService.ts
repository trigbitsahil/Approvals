/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTicketCommand } from "../models/CreateTicketCommand";
import type { CreateTicketCommandResponse } from "../models/CreateTicketCommandResponse";
import type { DeleteTicketCommandResponse } from "../models/DeleteTicketCommandResponse";
import type { GetTicketDetailQueryResponse } from "../models/GetTicketDetailQueryResponse";
import type { GetTicketListByUserQuery } from "../models/GetTicketListByUserQuery";
import type { GetTicketListByUserQueryResponse } from "../models/GetTicketListByUserQueryResponse";
import type { GetTicketListQuery } from "../models/GetTicketListQuery";
import type { GetTicketListQueryResponse } from "../models/GetTicketListQueryResponse";
import type { ProblemDetails } from "../models/ProblemDetails";
import type { UpdateStatusCommand } from "../models/UpdateStatusCommand";
import type { UpdateStatusCommandResponse } from "../models/UpdateStatusCommandResponse";
import type { UpdateTicketCommand } from "../models/UpdateTicketCommand";
import type { UpdateTicketCommandResponse } from "../models/UpdateTicketCommandResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

// Helper: Convert object to query string
const buildQueryString = (params?: Record<string, any>): string => {
  if (!params) return "";
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      qs.append(key, String(value));
    }
  });
  const query = qs.toString();
  return query ? `?${query}` : "";
};

export class TicketService {
  /**
   * GET /api/v{version}/Ticket
   * Now uses query string instead of body
   */
  public static getApiVTicket(
    version: string,
    requestBody?: GetTicketListQuery
  ): CancelablePromise<GetTicketListQueryResponse> {
    const query = buildQueryString(requestBody);
    return __request(OpenAPI, {
      method: "GET",
      url: `/api/v{version}/Ticket${query}`,
      path: { version },
      
    });
  }

  /**
   * POST /api/v{version}/Ticket
   */
  public static postApiVTicket(
    version: string,
    requestBody?: CreateTicketCommand
  ): CancelablePromise<CreateTicketCommandResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/Ticket",
      path: { version },
      body: requestBody,
      mediaType: "application/json",
      errors: { 400: `Bad Request` },
    });
  }

  /**
   * PUT /api/v{version}/Ticket
   */
  public static putApiVTicket(
    version: string,
    requestBody?: UpdateTicketCommand
  ): CancelablePromise<UpdateTicketCommandResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v{version}/Ticket",
      path: { version },
      body: requestBody,
      mediaType: "application/json",
      errors: { 400: `Bad Request` },
    });
  }

  /**
   * GET /api/v{version}/Ticket/GetTicketListByUser
   * Now uses query string
   */
  public static getTicketListByUser(
    version: string,
    requestBody?: GetTicketListByUserQuery
  ): CancelablePromise<GetTicketListByUserQueryResponse> {
    const query = buildQueryString(requestBody);
    return __request(OpenAPI, {
      method: "GET",
      url: `/api/v{version}/Ticket/GetTicketListByUser${query}`,
      path: { version },
    });
  }

  /**
   * GET /api/v{version}/Ticket/{id}
   */
  public static getTicketById(
    id: string,
    version: string
  ): CancelablePromise<GetTicketDetailQueryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/Ticket/{id}",
      path: { id, version },
      errors: { 404: `Not Found` },
    });
  }

  /**
   * DELETE /api/v{version}/Ticket/{id}
   */
  public static deleteTicket(
    id: string,
    version: string
  ): CancelablePromise<DeleteTicketCommandResponse | ProblemDetails> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v{version}/Ticket/{id}",
      path: { id, version },
      errors: { 400: `Bad Request` },
    });
  }

  /**
   * PUT /api/v{version}/Ticket/UpdateStatus
   */
  public static updateStatus(
    version: string,
    requestBody?: UpdateStatusCommand
  ): CancelablePromise<UpdateStatusCommandResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v{version}/Ticket/UpdateStatus",
      path: { version },
      body: requestBody,
      mediaType: "application/json",
      errors: { 400: `Bad Request` },
    });
  }

  /**
   * GET /api/v{version}/Ticket/SendFollowUpEmail
   */
  public static sendFollowUpEmail(
    version: string,
    ticketId?: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/Ticket/SendFollowUpEmail",
      path: {
        version: version,
      },
      query: {
        ticketId: ticketId,
      },
      errors: {
        400: `Bad Request`,
      },
    });
  }
}