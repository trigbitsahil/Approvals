// src/api/services/TicketTypeServiceFixed.ts

import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import type { GetTicketTypeListQueryResponse } from '../models/GetTicketTypeListQueryResponse';

export class TicketTypeServiceFixed {
  /**
   * Fixed version: sends departmentId as QUERY parameter (correct way)
   */
  public static getApiVTicketType(
    version: string,
    departmentId?: string | null
  ): Promise<GetTicketTypeListQueryResponse> {
    const params = new URLSearchParams();
    if (departmentId) {
      params.append('departmentId', departmentId);
    }

    return __request(OpenAPI, {
      method: 'GET',
      url: `/api/v${version}/TicketType`,
      query: Object.fromEntries(params), // correctly sends as ?departmentId=...
    });
  }
}