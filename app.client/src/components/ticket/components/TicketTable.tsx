import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { formatDate } from "../utils/formatters";
import { cn } from "@/utils/cn";

import { ChevronUp, ChevronDown } from "lucide-react";

interface TicketTableProps {
    tickets: any[];
    loading: boolean;
    onView: (ticketId: string) => void;
    onDelete: (ticketId: string) => void;
    statuses: Array<{ ticketStatusId: string; name: string }>;
    priorities: Array<{ ticketPriorityId: string; name: string }>;
    activeSortColumn?: string;
    sortOrder?: 0 | 1;
    onSort?: (column: string) => void;
}

export const TicketTable = ({
    tickets,
    loading,
    onView,
    onDelete,
    statuses,
    priorities,
    activeSortColumn,
    sortOrder,
    onSort,
}: TicketTableProps) => {

    const getSortIcons = (column: string) => {
        const isActive = activeSortColumn === column;
        const isAsc = sortOrder === 0;

        return (
            <div className="flex flex-col items-center -space-y-1">
                <ChevronUp
                    className={cn(
                        "h-3 w-3 transition-colors",
                        isActive && isAsc
                            ? "text-primary font-bold"
                            : "text-muted-foreground/40"
                    )}
                />
                <ChevronDown
                    className={cn(
                        "h-3 w-3 transition-colors",
                        isActive && !isAsc
                            ? "text-primary font-bold"
                            : "text-muted-foreground/40"
                    )}
                />
            </div>
        );
    };

    const SortableHead = ({ label, column, className }: { label: string; column: string; className?: string }) => (
        <TableHead
            className={cn("cursor-pointer hover:bg-muted/50 transition-colors select-none", className)}
            onClick={() => onSort?.(column)}
        >
            <div className="flex items-center gap-1">
                {label}
                {getSortIcons(column)}
            </div>
        </TableHead>
    );

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <span className="loading loading-spinner loading-lg">Loading...</span>
            </div>
        );
    }

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <SortableHead label="Ticket No" column="ticketNo" />
                        <SortableHead label="Title" column="title" />
                        <SortableHead label="Status" column="status" />
                        <SortableHead label="Priority" column="priority" />
                        <SortableHead label="Department" column="departmentName" />
                        <SortableHead label="Requested By" column="createdBy" />
                        <SortableHead label="Created" column="createdDate" />
                        <SortableHead label="Deadline Date" column="deadlineDate" />
                        <TableHead>TAT</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets.length > 0 ? (
                        tickets.map((ticket) => (
                            <TableRow
                                key={ticket.ticketId}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => onView(ticket.ticketId)}
                            >
                                <TableCell className="font-medium">{ticket.ticketNo}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{ticket.title}</span>
                                        <span className="text-sm text-muted-foreground">{ticket.ticketTypeName || "N/A"}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <StatusBadge statusId={ticket.ticketStatusId} statuses={statuses} />
                                </TableCell>
                                <TableCell>
                                    <PriorityBadge priorityId={ticket.ticketPriorityId} priorities={priorities} />
                                </TableCell>
                                <TableCell>{ticket.departmentName || "N/A"}</TableCell>
                                <TableCell>{ticket.requestedBy}</TableCell>
                                <TableCell>{formatDate(ticket.createdDate)}</TableCell>
                                <TableCell>{formatDate(ticket.deadlineDate)}</TableCell>
                                <TableCell className="font-semibold text-muted-foreground">{ticket.turnaroundTime || "-"}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onView(ticket.ticketId)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => onDelete(ticket.ticketId)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={10} className="text-center h-24">
                                No tickets found using current filters.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
