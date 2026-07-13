/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TicketListVM } from "./TicketListVM";
export type GetTicketListQueryResponse = {
  success?: boolean;
  message?: string | null;
  validationErrors?: Array<string> | null;
  data?: Array<TicketListVM> | null;
};
