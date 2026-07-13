import { useState, useEffect } from "react";
import { TicketHeader } from "./TicketHeader";
import { TicketInfo } from "./TicketInfo";
import { TicketComments } from "./TicketComments";
import { TicketAttachments } from "./TicketAttachments";
import type { Ticket, TicketCommentWithDocs } from "../types/ticket";
import type { DocumentUrlListVM } from "@/api/models/DocumentUrlListVM";
import { DocumentsService } from "@/api/services/DocumentsService";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TicketDetailViewProps {
    ticket: Ticket;
    comments: TicketCommentWithDocs[];
    documents: DocumentUrlListVM[];

    // Lookups
    statuses: Array<{ ticketStatusId: string; name: string }>;
    priorities: Array<{ ticketPriorityId: string; name: string }>;
    users: Array<{ id: string; email: string }>;
    ticketTypes: Array<{ ticketTypeId: string; name: string }>;
    loadingTypes: boolean;

    // Contract Info
    contractName: string;
    contractMediaUnitName: string;

    // Actions
    onUpdateTitle: (title: string) => Promise<void>;
    onUpdateDescription: (desc: string) => void;
    onUpdateTicket: (updatedFields: any) => Promise<void>;
    onSendMessage: (val: string, files: File[]) => Promise<void>;
    onDeleteAttachment: (id: string, name: string) => void;

    // State
    isHead: boolean;
    isUpdating: boolean;
    isSendingComment: boolean;

    teams?: Array<{ teamId: string; name: string }>;
    teamName?: string;
    currentUserEmail?: string;
}

export const TicketDetailView = ({
    ticket,
    comments,
    documents,
    statuses,
    priorities,
    users,
    ticketTypes,
    loadingTypes,
    contractName,
    contractMediaUnitName,
    onUpdateTitle,
    onUpdateDescription,
    onUpdateTicket,
    onSendMessage,
    onDeleteAttachment,
    isHead,
    isUpdating,
    isSendingComment,
    teams = [],
    teamName,
    currentUserEmail,
}: TicketDetailViewProps) => {

    // Local state for TicketInfo fields, initialized from ticket
    const [statusId, setStatusId] = useState(ticket.ticketStatusId);
    const [priorityId, setPriorityId] = useState(ticket.ticketPriorityId);
    const [departmentId, setDepartmentId] = useState(ticket.departmentId);
    const [typeId, setTypeId] = useState(ticket.ticketTypeId);
    const [assignee, setAssignee] = useState(ticket.assignee || ticket.assignedTo || null); // Handle both fields if inconsistent
    const [deadline, setDeadline] = useState(ticket.deadlineDate || null);
    const [description, setDescription] = useState(ticket.description);
    const [teamId, setTeamId] = useState(ticket.teamId || null);
    const [isClientRequestState, setIsClientRequestState] = useState(ticket.isClientRequest || false);

    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [pendingFields, setPendingFields] = useState<any>(null);

    // Sync local state when ticket changes (e.g. after refetch)
    useEffect(() => {
        setStatusId(ticket.ticketStatusId);
        setPriorityId(ticket.ticketPriorityId);
        setDepartmentId(ticket.departmentId);
        setTypeId(ticket.ticketTypeId);
        setAssignee(ticket.assignee || ticket.assignedTo || null);
        setDeadline(ticket.deadlineDate || null);
        setDescription(ticket.description);
        setTeamId(ticket.teamId || null);
        setIsClientRequestState(ticket.isClientRequest || false);
    }, [ticket]);

    const handleUpdate = async () => {
        const COMPLETED_STATUS_ID = "TcktStatus_2025_07_3175925d31-36bf-42cf-a52e-20524b48bc3f";
        const OPERATIONS_DEPARTMENT_ID = "Dep_2025_04_05de41fe70-a071-41b9-9529-dbb46ed122e0";

        const fieldsToUpdate = {
            ticketStatusId: statusId,
            ticketPriorityId: priorityId,
            departmentId,
            ticketTypeId: typeId,
            assignedTo: assignee,
            deadlineDate: deadline,
            description: description, // Update description too if changed via TicketInfo
            teamId,
            isClientRequest: isClientRequestState,
        };

        if (statusId === COMPLETED_STATUS_ID && departmentId === OPERATIONS_DEPARTMENT_ID && ticket.ticketStatusId !== COMPLETED_STATUS_ID) {
            const hasCompletedStateFile = (documents || []).some(
                (doc) => doc.documentType?.toLowerCase() === "ticketcompletion"
            );

            if (!hasCompletedStateFile) {
                setPendingFields(fieldsToUpdate);
                setShowUploadDialog(true);
                return;
            }
        }

        await onUpdateTicket(fieldsToUpdate);
    };

    const handleImageUploadAndSave = async () => {
        if (!uploadFile) {
            toast.error("Please select an image file to upload.");
            return;
        }

        setIsUploadingImage(true);
        try {
            const fileContent = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    resolve(result.split(",")[1]);
                };
                reader.onerror = reject;
                reader.readAsDataURL(uploadFile);
            });

            const extension = `.${uploadFile.name.split(".").pop() || ""}`.toLowerCase();

            const command = {
                name: "Completed_State",
                description: "Completed state image",
                content: fileContent,
                contentType: uploadFile.type || "image/jpeg",
                documentFileName: "Completed_State" + extension,
                extension: extension,
                category: "Ticket",
                categoryId: ticket.ticketId,
                documentType: "TicketCompletion",
                documentTypeId: ticket.ticketId,
            };

            await DocumentsService.postApiVDocuments("1", command);
            toast.success("Completed state image uploaded successfully.");

            if (pendingFields) {
                await onUpdateTicket(pendingFields);
            }
            setShowUploadDialog(false);
            setUploadFile(null);
            setPendingFields(null);
        } catch (error) {
            console.error("Failed to upload image or update ticket:", error);
            toast.error("Failed to upload image.");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleUpdateDescription = (newDesc: string) => {
        setDescription(newDesc);
        // Optional: trigger save immediately or wait for "Update" button?
        // TicketInfo has a "Save" button for description which calls onUpdateDescription.
        // If we want it to save to backend immediately:
        // onUpdateTicket({ description: newDesc }); 
        // But TicketInfo text says "Save", so maybe immediate? 
        // Let's defer to the main "Update" button for all changes to be atomic?
        // No, the original code had "Update" button for the right panel.
        // Description edit had "Save" which called update immediately? in original TicketDetail?
        // Original TicketDetail: 
        // "Save Changes" for Description/Contract.
        // "Update" button for Status/Priority.
        // So they were separate updates.
        // I'll support immediate update for description here.

        // Actually, let's keep it consistent. TicketInfo calls onUpdateDescription.
        // If we want immediate save:
        onUpdateTicket({ description: newDesc });
    };

    return (
        <div className="pb-10">
            <TicketHeader
                title={ticket.title}
                ticketNo={ticket.ticketNo}
                onUpdateTitle={onUpdateTitle}
            />

            <TicketInfo
                description={description}
                contractName={contractName}
                contractMediaUnitName={contractMediaUnitName}
                requestedBy={ticket.requestedBy}
                createdDate={ticket.createdDate}
                turnaroundTime={ticket.turnaroundTime}
                followUps={ticket.followUps}
                mediaType={ticket.mediaType}
                issueCategory={ticket.issueCategory}
                onUpdateDescription={handleUpdateDescription}

                statusId={statusId}

                setStatusId={setStatusId}
                priorityId={priorityId}
                setPriorityId={setPriorityId}
                departmentId={departmentId}
                setDepartmentId={setDepartmentId}
                typeId={typeId}
                setTypeId={setTypeId}
                assignee={assignee}
                setAssignee={setAssignee}
                deadline={deadline}
                setDeadline={setDeadline}
                teamId={teamId}
                setTeamId={setTeamId}
                isClientRequest={isClientRequestState}
                setIsClientRequest={setIsClientRequestState}
                ticket={ticket}

                statuses={statuses}
                priorities={priorities}
                users={users}
                ticketTypes={ticketTypes}
                loadingTypes={loadingTypes}
                teams={teams}
                teamName={teamName || ticket.teamName}
                currentUserEmail={currentUserEmail}

                isHead={isHead}
                isUpdating={isUpdating}
                onUpdate={handleUpdate}
                extraMainContent={
                    <TicketComments
                        comments={comments}
                        onSendMessage={onSendMessage}
                        isSending={isSendingComment}
                    />
                }
                extraSidebarContent={
                    <TicketAttachments
                        documents={documents}
                        onDelete={onDeleteAttachment}
                        canDelete={true}
                    />
                }
            />

            {/* Dialog to upload completed state image */}
            <Dialog open={showUploadDialog} onOpenChange={(open) => {
                if (!open && !isUploadingImage) {
                    setShowUploadDialog(false);
                    setUploadFile(null);
                    setPendingFields(null);
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload completed state image</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 my-4">
                        <Label htmlFor="completed-image-upload">Select Image (Mandatory)</Label>
                        <Input
                            id="completed-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setUploadFile(file);
                            }}
                            disabled={isUploadingImage}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowUploadDialog(false);
                                setUploadFile(null);
                                setPendingFields(null);
                            }}
                            disabled={isUploadingImage}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleImageUploadAndSave}
                            disabled={isUploadingImage || !uploadFile}
                        >
                            {isUploadingImage ? "Uploading..." : "Upload & Complete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
