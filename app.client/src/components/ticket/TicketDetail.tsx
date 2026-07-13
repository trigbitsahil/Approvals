"use client";

import { useEffect, useState } from "react";
import type { Ticket, TicketCommentWithDocs } from "./types/ticket";
import type { DocumentUrlListVM } from "@/api/models/DocumentUrlListVM";
import { TicketCommentService } from "@/api/services/TicketCommentService";
import { DocumentsService } from "@/api/services/DocumentsService";
import { toast } from "sonner";
import { TicketDetailView } from "./detail/TicketDetailView";
import { useTicketActions } from "./hooks/useTicketActions";
import { useTicketLookups } from "./hooks/useTicketLookups";

const API_VERSION = "1";

interface TicketDetailProps {
  ticket: Ticket;
  contractName?: string;
  contractMediaUnitName?: string;
  onTicketUpdated: () => void;
  onMessageSend: () => void;
  statuses: Array<{ ticketStatusId: string; name: string }>;
  priorities: Array<{ ticketPriorityId: string; name: string }>;
  // Relaxed type definition to match parent usage which might use ticketTypeName
  types: Array<{ ticketTypeId?: string; ticketTypeName?: string; name: string }>;
  users: Array<{ id: string; email: string }>;
  contracts: Array<{ contractId: string; name: string }>;
  mediaUnits: Array<{ contractMediaUnitId: string; name: string }>;
  onContractChange: (contractId?: string) => void;
  documents: DocumentUrlListVM[];
  teams?: Array<{ teamId: string; name: string }>;
}

export default function TicketDetail({
  ticket,
  contractName: propContractName,
  contractMediaUnitName: propMediaUnitName,
  onTicketUpdated,
  onMessageSend,
  statuses,
  priorities,
  users,
  documents,
  teams = [],
}: TicketDetailProps) {
  const {
    isUpdating,
    isSendingComment,
    updateTicketTitle,
    updateTicket,
    sendMessage,
    deleteAttachment,
  } = useTicketActions(API_VERSION);

  const {
    ticketTypes,
    loadingTypes,
    loadTicketTypes,
    contractName,
    mediaUnitName,
    loadContractMedia
  } = useTicketLookups(API_VERSION);

  const [comments, setComments] = useState<TicketCommentWithDocs[]>([]);
  const [isHead, setIsHead] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  // Check user role and get current user email
  useEffect(() => {
    const checkRole = async () => {
      try {
        const { UserService } = await import("@/api/services/UserService");
        const loggedInUserRes = await UserService.getLoggedInUser(API_VERSION);
        if (loggedInUserRes.data?.id) {
          const rolesRes = await UserService.getUserRoles(API_VERSION, loggedInUserRes.data.id);
          const roles = rolesRes.data || [];
          setIsHead(roles.includes("OperationHead") || roles.includes("HRHead"));
        }
        if (loggedInUserRes.data?.email) {
          setCurrentUserEmail(loggedInUserRes.data.email);
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkRole();
  }, []);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!ticket.ticketId) return;
      try {
        const commentsResponse = await TicketCommentService.getApiVTicketComment(
          API_VERSION,
          ticket.ticketId
        );
        const fetchedComments = commentsResponse.data || [];

        const commentsWithDocs = await Promise.all(
          fetchedComments.map(async (comment) => {
            try {
              const docsResponse = await DocumentsService.getApiVDocuments(
                API_VERSION,
                "TicketComment",
                comment.ticketCommentId
              );
              return { ...comment, documents: docsResponse.data || [] };
            } catch {
              return { ...comment, documents: [] };
            }
          })
        );

        setComments(commentsWithDocs.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()));
      } catch (error) {
        console.error("Failed to fetch comments", error);
        toast.error("Failed to load comments");
      }
    };
    fetchComments();
  }, [ticket.ticketId, isSendingComment]);

  // Load types and contract info
  useEffect(() => {
    if (ticket.departmentId) {
      loadTicketTypes(ticket.departmentId);
    }
    if (ticket.ticketId) {
      loadContractMedia(ticket.ticketId);
    }
  }, [ticket.departmentId, ticket.ticketId, loadTicketTypes, loadContractMedia]);

  const handleUpdate = async (updatedFields: any) => {
    await updateTicket(ticket, updatedFields, () => {
      if (onTicketUpdated) onTicketUpdated();
    });
  };

  const handleSendMessage = async (msg: string, files: File[]) => {
    await sendMessage(
      ticket.ticketId,
      ticket.ticketNo,
      msg,
      files,
      ticket.requestedBy || "Agent",
      (newComment, uploadedDocs) => {
        onMessageSend();
      }
    );
  };

  return (
    <TicketDetailView
      ticket={ticket}
      comments={comments}
      documents={documents}
      statuses={statuses}
      priorities={priorities}
      users={users}
      ticketTypes={ticketTypes}
      loadingTypes={loadingTypes}
      contractName={propContractName || contractName}
      contractMediaUnitName={propMediaUnitName || mediaUnitName}

      onUpdateTitle={(t) => updateTicketTitle(ticket, t, onTicketUpdated)}
      onUpdateDescription={(d) => handleUpdate({ description: d })}
      onUpdateTicket={handleUpdate}
      onSendMessage={handleSendMessage}
      onDeleteAttachment={(id, name) => deleteAttachment(id, name, onMessageSend)}

      isHead={isHead}
      isUpdating={isUpdating}
      isSendingComment={isSendingComment}
      teams={teams}
      teamName={ticket.teamName}
      currentUserEmail={currentUserEmail}
    />
  );
}
