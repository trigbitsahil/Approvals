/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GetTicketListByUserQuery = {
  ticketNo?: string | null;
  searchText?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  ticketStatusId?: string | null;
  ticketPriorityId?: string | null;
  ticketTypeId?: string | null;
  isCompleted?: boolean;
  isClosed?: boolean;
  assignedTo?: string | null;
  pageNumber?: number;
  pageSize?: number;
  sortOrder?: string | null;
  filterType?: string | null;
  departmentId?: string | null;
  departmentName?: string | null;
  requestedBy?: string | null;
  isClientRequest?: boolean | null;
};
