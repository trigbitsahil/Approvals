// src/components/ticket/types/ticket.ts

export type TicketStatus = "open" | "in-progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface Ticket {
  // Core identifiers
  id: string;
  ticketId: string;
  ticketNo: string;
  ticketTypeName: string;
  departmentName: string;
  // Content
  title: string;
  description: string;
  category: string;

  // Status & Priority
  ticketStatusId: string;
  status: TicketStatus; // UI-friendly alias
  ticketPriorityId: string | TicketPriority; // Can be ID or name

  // Type & Assignment
  ticketTypeId: string;
  assignee: string;
  requestedBy: string;
  departmentId: string;

  // Dates
  createdDate: string;
  updatedAt: string;
  deadlineDate: string;
  isResolved?: boolean;
  resolvedDate?: string;
  isCompleted?: boolean;
  completedDate?: string;

  // Customer
  customer: {
    name: string;
    email: string;
    phone: string;
  };

  // Documents
  documents: Array<{
    name: string;
    url: string;
    type?: string;
    size?: number;
  }>;

  // Messages (comments)
  messages: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: string;
    isCustomer: boolean;
  }>;

  // Contract & Media Units
  contractId?: string;
  mediaUnitIds?: string[];

  // NEW: Populated from TicketContractMediaUnit API
  contractName?: string;          // <-- NEW
  contractMediaUnitName?: string;

  turnaroundTime?: string;
  followUps?: TicketFollowUp[];
  mediaType?: string;
  issueCategory?: string;
  isClientRequest?: boolean;
}


export interface TicketFollowUp {
  ticketFollowUpId: string;
  ticketId: string;
  followedUpBy: string;
  followedUpDate: string;
}

export interface TicketComment {
  ticketCommentId: string;
  ticketId: string;
  commentText: string;
  isVoided: boolean;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string | null;
  lastModifiedDate: string | null;
}

export interface TicketCommentWithDocs extends TicketComment {
  documents?: Array<{
    name: string;
    url?: string;
    size?: number;
    type?: string;
    documentID?: string; // added for delete
    // documentUrlListVM Props
    contentType?: string;
    extension?: string;
  }>;
}