import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
import type { CancelablePromise } from "../core/CancelablePromise";

// ── Share Link ──────────────────────────────────────────────────────────────

export interface CreateShareLinkPayload {
  category: string;
  categoryId: string;
  days: number;
}

export interface ShareLinkVM {
  shareLinkId: string;
  category: string;
  categoryId: string;
  shareableLink: string;
  expiryDate?: string;
  createdDate?: string;
}

export interface ShareLinkResponse {
  success: boolean;
  shareableLink?: string;
  message?: string;
}

export class ShareLinkService {
  /**
   * POST /api/v{version}/ShareLinks — Create a new shareable link
   */
  public static createShareLink(
    version: string,
    payload: CreateShareLinkPayload
  ): CancelablePromise<ShareLinkResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: `/api/v${version}/ShareLinks`,
      body: payload,
      mediaType: "application/json",
    });
  }

  /**
   * GET /api/v{version}/ShareLinks — Get existing share links for a category
   */
  public static getShareLinks(
    version: string,
    category: string,
    categoryId: string
  ): CancelablePromise<{ success: boolean; data: ShareLinkVM[] }> {
    return __request(OpenAPI, {
      method: "GET",
      url: `/api/v${version}/ShareLinks`,
      query: { category, categoryId },
    });
  }

  /**
   * DELETE /api/v{version}/ShareLinks/{shareLinkId}
   */
  public static deleteShareLink(
    version: string,
    shareLinkId: string
  ): CancelablePromise<{ success: boolean }> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: `/api/v${version}/ShareLinks/${shareLinkId}`,
    });
  }
}

// ── Draft / Letter ──────────────────────────────────────────────────────────

export interface DraftVM {
  letterId: string;
  subject?: string;
  draftType?: string;
  createdDate?: string;
  status?: string;
}

export class DraftService {
  /**
   * GET /api/v{version}/Drafts — Get all drafts for a category
   */
  public static getDraftsList(
    version: string,
    category: string,
    categoryId: string
  ): CancelablePromise<{ success: boolean; data: DraftVM[] }> {
    return __request(OpenAPI, {
      method: "GET",
      url: `/api/v${version}/Drafts`,
      query: { category, categoryId },
    });
  }

  /**
   * GET /api/v{version}/Approvals — Get approvals for a category
   */
  public static getApprovalsList(
    version: string,
    category: string,
    categoryId: string
  ): CancelablePromise<{ success: boolean; data: any[] }> {
    return __request(OpenAPI, {
      method: "GET",
      url: `/api/v${version}/Approvals`,
      query: { category, categoryId },
    });
  }
}
