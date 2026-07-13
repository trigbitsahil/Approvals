import { useState } from "react";
import { TicketService } from "@/api/services/TicketService";
import { TicketCommentService } from "@/api/services/TicketCommentService";
import { DocumentsService } from "@/api/services/DocumentsService";
import { toast } from "sonner";
import { getMimeType } from "@/utils/file-utils";
import type { CreateTicketCommentCommand } from "@/api/models/CreateTicketCommentCommand";
import type { CreateDocumentUrlCommand } from "@/api/models/CreateDocumentUrlCommand";
import type { DocumentUrlListVM } from "@/api/models/DocumentUrlListVM";
import { useConfirmation } from "@/contexts/ConfirmationContext";

export const useTicketActions = (apiVersion: string = "1") => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isSendingComment, setIsSendingComment] = useState(false);
    const { confirm } = useConfirmation();

    const updateTicketTitle = async (
        ticket: any,
        newTitle: string,
        onSuccess?: () => void
    ) => {
        if (!newTitle.trim()) {
            toast.error("Ticket title cannot be empty");
            return;
        }

        try {
            const updated = {
                ...ticket,
                title: newTitle.trim(),
                notes: ticket.notes || "",
            };
            await TicketService.putApiVTicket(apiVersion, updated);
            toast.success("Title updated");
            if (onSuccess) onSuccess();
        } catch (err) {
            toast.error("Failed to update title");
            console.error(err);
        }
    };

    const updateTicket = async (
        ticket: any,
        updatedFields: any,
        onSuccess?: () => void
    ) => {
        setIsUpdating(true);
        try {
            const updatedTicketData = {
                ...ticket,
                ...updatedFields,
                notes: updatedFields.notes || ticket.notes || "",
            };

            await TicketService.putApiVTicket(apiVersion, updatedTicketData);

            if (updatedFields.ticketStatusId !== undefined && updatedFields.ticketStatusId !== ticket.ticketStatusId) {
                await TicketService.updateStatus(apiVersion, {
                    ticketId: ticket.ticketId,
                    ticketStatusId: updatedFields.ticketStatusId,
                });
            }

            toast.success("Ticket updated successfully!");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to update ticket:", error);
            toast.error("Failed to update ticket.");
        } finally {
            setIsUpdating(false);
        }
    };

    const sendMessage = async (
        ticketId: string,
        ticketNo: string,
        message: string,
        files: File[],
        commentedBy: string,
        onSuccess?: (newComment: any, uploadedDocs: DocumentUrlListVM[]) => void
    ) => {
        if (!message.trim() && files.length === 0) {
            toast.info("Please enter a message or attach a file.");
            return;
        }

        setIsSendingComment(true);
        try {
            // 1. Post the comment
            const commentData: CreateTicketCommentCommand = {
                TicketId: ticketId,
                commentText: message.trim(),
                commentedBy: commentedBy,
                commentedAt: new Date().toISOString(),
            };
            const commentResponse = await TicketCommentService.postApiVTicketComment(
                apiVersion,
                commentData
            );
            const newCommentId = commentResponse.data.ticketCommentId;
            toast.success("Comment sent successfully!");

            const uploadedDocumentsForComment: DocumentUrlListVM[] = [];

            // 2. Upload associated documents
            if (files.length > 0) {
                const uploadPromises = files.map(async (file) => {
                    const fileContent = await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const result = reader.result as string;
                            resolve(result.split(",")[1]);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });

                    const extension = `.${file.name.split(".").pop() || ""}`.toLowerCase();

                    // Upload 1: Link to the main ticket (for "Attachments" section)
                    const documentDataForTicket: CreateDocumentUrlCommand = {
                        name: file.name,
                        description: `Attachment for ticket ${ticketNo} (from comment)`,
                        content: fileContent,
                        contentType: file.type || getMimeType(file.name),
                        documentFileName: file.name,
                        extension: extension,
                        category: "Ticket",
                        categoryId: ticketId,
                    };
                    await DocumentsService.postApiVDocuments(
                        apiVersion,
                        documentDataForTicket
                    );

                    // Upload 2: Link to the specific comment (for inline display in comments)
                    const documentDataForComment: CreateDocumentUrlCommand = {
                        name: file.name,
                        description: `Attachment for comment on ticket ${ticketNo}`,
                        content: fileContent,
                        contentType: file.type || getMimeType(file.name),
                        documentFileName: file.name,
                        extension: extension,
                        category: "TicketComment",
                        categoryId: newCommentId,
                    };
                    const docResponseForComment = await DocumentsService.postApiVDocuments(
                        apiVersion,
                        documentDataForComment
                    );
                    return docResponseForComment.data;
                });

                const results = await Promise.all(uploadPromises);
                uploadedDocumentsForComment.push(...results);
                toast.success("Documents uploaded successfully");
            }

            if (onSuccess) {
                onSuccess(commentResponse.data, uploadedDocumentsForComment);
            }
        } catch (error) {
            console.error("Failed to send comment or upload documents:", error);
            toast.error("Failed to send comment or upload documents.");
        } finally {
            setIsSendingComment(false);
        }
    };

    const deleteAttachment = async (
        documentId: string,
        documentName: string,
        onSuccess?: () => void
    ) => {
        const isConfirmed = await confirm({
            title: "Delete Attachment",
            description: `Are you sure you want to delete "${documentName}"? This action cannot be undone.`,
            confirmLabel: "Delete",
            cancelLabel: "Cancel"
        });
        if (!isConfirmed) return;
        try {
            await DocumentsService.deleteApiVDocuments(apiVersion, documentId);
            toast.success(`Document "${documentName}" deleted successfully.`);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to delete document:", error);
            toast.error(`Failed to delete document "${documentName}".`);
        }
    };

    return {
        isUpdating,
        isSendingComment,
        updateTicketTitle,
        updateTicket,
        sendMessage,
        deleteAttachment,
    };
};
