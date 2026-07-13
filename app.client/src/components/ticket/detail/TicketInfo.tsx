import { useState, useEffect, ReactNode } from "react";
import { format } from "date-fns";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    getPriorityColor,
    getDepartmentName,
} from "../utils/ticketHelpers";
import { Building2, Pencil } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePickerInput } from "@/components/ui/date-time-picker-input";

interface TicketInfoProps {
    // Description part
    description: string;
    contractName: string;
    contractMediaUnitName: string;
    requestedBy: string;
    createdDate: string;
    turnaroundTime?: string;
    onUpdateDescription: (desc: string) => void;
    mediaType?: string;
    issueCategory?: string;


    // Attributes part
    statusId: string;
    setStatusId: (id: string) => void;
    priorityId: string;
    setPriorityId: (id: string) => void;
    departmentId: string; // Add departmentId
    setDepartmentId: (id: string) => void; // Add setDepartmentId
    typeId: string; // Add typeId
    setTypeId: (id: string) => void; // Add setTypeId
    assignee: string | null;
    setAssignee: (email: string | null) => void;
    deadline: string | null;
    setDeadline: (date: string | null) => void;
    teamId: string | null;
    setTeamId: (id: string | null) => void;
    isClientRequest: boolean;
    setIsClientRequest: (val: boolean) => void;
    ticket: Ticket;

    // Options
    statuses: Array<{ ticketStatusId: string; name: string }>;
    priorities: Array<{ ticketPriorityId: string; name: string }>;
    users: Array<{ id: string; email: string }>;
    ticketTypes: Array<{ ticketTypeId: string; name: string }>; // Add ticketTypes prop
    loadingTypes?: boolean; // Add loadingTypes prop
    teams?: Array<{ teamId: string; name: string }>;
    teamName?: string;

    // Permissions/State
    isHead: boolean;
    isUpdating: boolean;
    onUpdate: () => void;

    // Extra content
    extraMainContent?: ReactNode;
    extraSidebarContent?: ReactNode;
    currentUserEmail?: string;
    followUps?: Array<{
        ticketFollowUpId: string;
        ticketId: string;
        followedUpBy: string;
        followedUpDate: string;
    }>;
}

export const TicketInfo = ({
    description,
    contractName,
    contractMediaUnitName,
    requestedBy,
    createdDate,
    turnaroundTime,
    onUpdateDescription,
    mediaType,
    issueCategory,

    statusId,

    setStatusId,
    priorityId,
    setPriorityId,
    departmentId,
    setDepartmentId,
    typeId,
    setTypeId,
    assignee,
    setAssignee,
    deadline,
    setDeadline,
    teamId,
    setTeamId,
    isClientRequest,
    setIsClientRequest,
    ticket,

    statuses,
    priorities,
    users,
    ticketTypes,
    loadingTypes,
    teams = [],
    teamName,

    isHead,
    isUpdating,
    onUpdate,

    extraMainContent,
    extraSidebarContent,
    currentUserEmail,
    followUps = [],
}: TicketInfoProps) => {
    const [editedDescription, setEditedDescription] = useState(description);
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [searchAssignee, setSearchAssignee] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(users);

    useEffect(() => {
        setEditedDescription(description);
    }, [description]);

    useEffect(() => {
        if (searchAssignee) {
            setFilteredUsers(users.filter(u => u.email.toLowerCase().includes(searchAssignee.toLowerCase())));
        } else {
            setFilteredUsers(users);
        }
    }, [searchAssignee, users]);


    const isCreator = !!(currentUserEmail && requestedBy && currentUserEmail.toLowerCase() === requestedBy.toLowerCase());
    const visibleStatuses = statuses.filter((s) => {
        if (s.ticketStatusId === "TcktStatus_2025_07_3181ef0640-ad38-4a5d-a201-d683f73b7226") {
            return isCreator || statusId === "TcktStatus_2025_07_3181ef0640-ad38-4a5d-a201-d683f73b7226";
        }
        return true;
    });
    const isStatusChangeDisabled = statusId === "TcktStatus_2025_07_3181ef0640-ad38-4a5d-a201-d683f73b7226" && !isCreator;

    const handleSaveDescription = () => {
        onUpdateDescription(editedDescription);
        setIsEditingDesc(false);
    };

    return (
        <div className="grid md:grid-cols-3 gap-6 h-full">
            {/* LEFT COLUMN: Description + Contract Info */}
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                <Label className="text-2xl" htmlFor="edit-description">
                                    Description
                                </Label>
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsEditingDesc(!isEditingDesc)}
                            >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit Description</span>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isEditingDesc ? (
                            <div className="space-y-4">
                                <Textarea
                                    id="edit-description"
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    rows={3}
                                    className="resize-none"
                                />
                                <div className="flex gap-2">
                                    <Button onClick={handleSaveDescription} size="sm">Save</Button>
                                    <Button variant="outline" size="sm" onClick={() => {
                                        setEditedDescription(description);
                                        setIsEditingDesc(false);
                                    }}>Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <p className="font-semibold">{description || "No description"}</p>
                        )}
                    </CardContent>
                </Card>

                {/* Contract & Media Info */}
                <Card>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Contract</p>
                                    <p className="font-semibold truncate">{contractName}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Media Unit</p>
                                    <p className="font-semibold">{contractMediaUnitName}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Linked Team</p>
                                    <p className="font-semibold">{teamName || "None"}</p>
                                </div>
                                {mediaType && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Media Type</p>
                                        <Badge variant="outline" className="mt-1 font-semibold">{mediaType}</Badge>
                                    </div>
                                )}
                                {issueCategory && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Issue Category</p>
                                        <p className="font-semibold">{issueCategory}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Client Request</p>
                                    <Badge variant={ticket.isClientRequest ? "default" : "secondary"} className="mt-1 font-semibold">
                                        {ticket.isClientRequest ? "Yes" : "No"}
                                    </Badge>
                                </div>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Requested By</p>
                                <p className="font-semibold">{requestedBy || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Created At</p>
                                <p className="font-semibold">
                                    {createdDate ? format(new Date(createdDate), "dd/MM/yyyy, HH:mm:ss") : "N/A"}
                                </p>
                            </div>
                            {turnaroundTime && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Turnaround Time (TAT)</p>
                                    <p className="font-semibold text-green-600 dark:text-green-400">{turnaroundTime}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Follow-up History */}
                {followUps && followUps.length > 0 && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold">Follow-Up History</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {followUps.map((fu) => (
                                <div key={fu.ticketFollowUpId} className="flex justify-between items-center text-sm border-b pb-2 last:border-b-0 last:pb-0">
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{fu.followedUpBy}</span>
                                        <span className="text-xs text-muted-foreground">Requested a follow up</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground font-medium">
                                        {format(new Date(fu.followedUpDate), "dd/MM/yyyy, HH:mm:ss")}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {extraMainContent}
            </div>

            {/* RIGHT COLUMN: Attributes (Status, Priority, etc) */}
            <div className="md:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Ticket Status & Priority</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Status */}
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={statusId} onValueChange={setStatusId} disabled={isStatusChangeDisabled}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {visibleStatuses.map((s) => (
                                        <SelectItem key={s.ticketStatusId} value={s.ticketStatusId}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select value={priorityId} onValueChange={setPriorityId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    {priorities.map((p) => (
                                        <SelectItem key={p.ticketPriorityId} value={p.ticketPriorityId}>
                                            <Badge variant="secondary" className={getPriorityColor(p.ticketPriorityId, priorities)}>
                                                {p.name}
                                            </Badge>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Department */}
                        <div className="space-y-2">
                            <Label>Department</Label>
                            <Select value={departmentId} onValueChange={setDepartmentId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Dep_2025_04_05de41fe70-a071-41b9-9529-dbb46ed122e0">Operations Department</SelectItem>
                                    <SelectItem value="Dep_2025_08_0131badf7b-5ae7-4f76-abb8-dfca79eac03d">HR Department</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                            <Label>Type {loadingTypes && "(loading...)"}</Label>
                            <Select
                                value={typeId}
                                onValueChange={setTypeId}
                                disabled={loadingTypes || !ticketTypes || ticketTypes.length === 0}
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={
                                            loadingTypes
                                                ? "Loading types..."
                                                : (!ticketTypes || ticketTypes.length === 0)
                                                    ? "No types available"
                                                    : "Select type"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {ticketTypes && ticketTypes.map(t => (
                                        <SelectItem key={t.ticketTypeId} value={t.ticketTypeId}>
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>


                        {/* Assignee */}
                        <div className="space-y-2">
                            <Label>Assignee</Label>
                            <Select
                                value={assignee || "unassigned"}
                                onValueChange={(val) => setAssignee(val === "unassigned" ? null : val)}
                            >
                                <SelectTrigger disabled={!isHead}>
                                    <SelectValue placeholder="Search assignee..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                    <Input
                                        placeholder="Search by email..."
                                        value={searchAssignee}
                                        onChange={(e) => setSearchAssignee(e.target.value)}
                                        className="w-full mb-2 p-2 border rounded"
                                    />
                                    {filteredUsers.map((user) => (
                                        <SelectItem key={user.id} value={user.email}>{user.email}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Linked Team */}
                        <div className="space-y-2">
                            <Label>Linked Team (Optional)</Label>
                            <Select
                                value={teamId || "none"}
                                onValueChange={(val) => setTeamId(val === "none" ? null : val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select team" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {teams.map((t) => (
                                        <SelectItem key={t.teamId} value={t.teamId}>
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Deadline */}
                        <div className="space-y-2">
                            <Label>Deadline Date</Label>
                            <DateTimePickerInput
                                value={deadline || null}
                                onChange={(val) => setDeadline(val)}
                                disabled={!isHead}
                                className={isHead ? "" : "opacity-70 bg-muted/50"}
                            />
                        </div>

                        {/* Client Request Toggle */}
                        <div className="flex items-center gap-2 pt-2">
                            <Checkbox
                                id="detail-isClientRequest"
                                checked={isClientRequest}
                                onCheckedChange={(checked) => setIsClientRequest(!!checked)}
                            />
                            <Label htmlFor="detail-isClientRequest" className="cursor-pointer font-medium">
                                Is Client Request
                            </Label>
                        </div>

                        {/* Update Button */}
                        <div className="flex justify-end pt-4">
                            <Button onClick={onUpdate} disabled={isUpdating} className="w-full">
                                {isUpdating ? "Updating..." : "Update"}
                            </Button>
                        </div>

                    </CardContent>
                </Card>
                {extraSidebarContent}
            </div>
        </div >
    );
};
