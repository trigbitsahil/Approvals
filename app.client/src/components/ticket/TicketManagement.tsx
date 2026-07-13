"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TicketStats } from "./components/TicketStats";
import { TicketFilters } from "./components/TicketFilters";
import { TicketTable } from "./components/TicketTable";
import { TicketForm } from "./TicketForm";
import { useTicketFilters } from "./hooks/useTicketFilters";
import { useTickets } from "./hooks/useTickets";
import { useCommonLookups } from "./hooks/useCommonLookups";
import { useConfirmation } from "@/contexts/ConfirmationContext";
import { TicketService } from "@/api/services/TicketService";
import { TicketContractMediaUnitService } from "@/api/services/TicketContractMediaUnitService";
import { TeamService } from "@/api/services/TeamService";
import { UserService } from "@/api/services/UserService";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function TicketManagement() {
    const navigate = useNavigate();
    const { filters, setFilter, clearFilters, activeFilterCount } = useTicketFilters();
    const { tickets, loading, pagination, setPagination, goToPage, stats, refetch, activeSortColumn, sortOrder, handleSort, totalCount } = useTickets(filters);
    const { statuses, priorities, contracts, mediaUnits, loadMediaUnits } = useCommonLookups();
    const { confirm } = useConfirmation();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [teams, setTeams] = useState<Array<{ teamId: string; name: string }>>([]);
    const [users, setUsers] = useState<Array<{ id: string; email: string }>>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teamRes, usrRes] = await Promise.all([
                    TeamService.getApiVTeam("1"),
                    UserService.getApiVUser("1"),
                ]);
                setTeams((teamRes.data || []).map((t: any) => ({
                    teamId: t.teamId || t.id,
                    name: t.name,
                })));
                setUsers((usrRes.data || []).map((u: any) => ({
                    id: u.id,
                    email: u.email,
                })));
            } catch (e) {
                console.error("Failed to load lookups:", e);
            }
        };
        fetchData();
    }, []);

    // Stats Logic - Since API doesn't provide it in list, we might rely on the 'stats' from useTickets 
    // which currently returns dummy 0s. 
    // A real impl would fetch stats endpoint. 
    // For now, I will assume defaults or implemented locally.

    const handleCreateTicket = async (ticketData: any) => {
        setIsCreating(true);
        try {
            // Step 1: Create the ticket and capture the response
            const response = await TicketService.postApiVTicket("1", {
                ...ticketData,
            });

            const ticketId = response.data?.ticketId;
            const ticketNo = response.data?.ticketNo;

            // Step 2: Link each selected media unit to the created ticket
            if (ticketId && ticketData.mediaUnitIds && ticketData.mediaUnitIds.length > 0) {
                await Promise.all(
                    (ticketData.mediaUnitIds as string[]).map((contractMediaUnitId: string) =>
                        TicketContractMediaUnitService.postApiVTicketContractMediaUnit("1", {
                            ticketId,
                            contractMediaUnitId,
                        })
                    )
                );
            }

            toast.success("Ticket created successfully");
            setIsCreateOpen(false);
            refetch();
            return { id: ticketId || "", ticketNo: ticketNo || "" };
        } catch (e) {
            console.error(e);
            toast.error("Failed to create ticket");
            throw e;
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteTicket = async (id: string) => {
        const isConfirmed = await confirm({
            title: "Delete Ticket",
            message: "Are you sure you want to delete this ticket? This action cannot be undone.",
            confirmLabel: "Delete",
            cancelLabel: "Cancel"
        });
        if (!isConfirmed) return;
        try {
            await TicketService.deleteTicket(id, "1");
            toast.success("Ticket deleted");
            refetch();
        } catch (e) {
            toast.error("Failed to delete ticket");
        }
    };

    // Calculate Average Time to Resolve
    const resolvedTickets = (tickets || []).filter(
        (t) => (t.isResolved && t.resolvedDate) || (t.isCompleted && t.completedDate)
    );

    let avgResolveTimeStr = "N/A";
    if (resolvedTickets.length > 0) {
        const totalDuration = resolvedTickets.reduce((sum, t) => {
            const endDate = new Date(t.completedDate || t.resolvedDate!);
            const startDate = new Date(t.createdDate);
            return sum + (endDate.getTime() - startDate.getTime());
        }, 0);
        const avgDurationMs = totalDuration / resolvedTickets.length;

        const minutes = Math.floor(avgDurationMs / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        const d = days;
        const h = hours % 24;
        const m = minutes % 60;

        const parts = [];
        if (d > 0) parts.push(`${d}d`);
        if (h > 0) parts.push(`${h}h`);
        if (m > 0 || parts.length === 0) parts.push(`${m}m`);
        avgResolveTimeStr = parts.join(" ");
    }

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
                    <p className="text-muted-foreground">
                        Manage and track your support tickets
                    </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                    <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" /> Create Ticket
                    </Button>
                    <div className="text-xs text-muted-foreground font-medium">
                        Avg Resolve Time: <span className="text-foreground font-semibold">{avgResolveTimeStr}</span>
                    </div>
                </div>
            </div>

            <TicketStats
                stats={stats}
                onFilterByStatus={(s) => setFilter("statusId", s)}
                activeStatusFilter={filters.statusId}
                statuses={statuses}
            />

            <div className="space-y-4">
                <TicketFilters
                    filters={filters}
                    setFilter={setFilter}
                    clearFilters={clearFilters}
                    statuses={statuses}
                    priorities={priorities}
                    users={users}
                />

                <TicketTable
                    tickets={tickets}
                    loading={loading}
                    statuses={statuses}
                    priorities={priorities}
                    onView={(id) => navigate(`/tickets/${id}`)}
                    onDelete={handleDeleteTicket}
                    activeSortColumn={activeSortColumn}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                />

                {/* Pagination Controls */}
                <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Rows per page</span>
                        <Select
                            value={pagination.pageSize.toString()}
                            onValueChange={(value) => setPagination({ pageIndex: 0, pageSize: parseInt(value) })}
                        >
                            <SelectTrigger className="w-[70px] h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-6">
                        <span className="text-sm text-muted-foreground">
                            Page {pagination.pageIndex + 1} of {Math.max(1, Math.ceil(totalCount / pagination.pageSize))}
                        </span>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => goToPage(Math.max(0, pagination.pageIndex - 1))}
                                disabled={pagination.pageIndex === 0 || loading}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => goToPage(pagination.pageIndex + 1)}
                                disabled={pagination.pageIndex >= Math.ceil(totalCount / pagination.pageSize) - 1 || loading}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create New Ticket</DialogTitle>
                    </DialogHeader>
                    <TicketForm
                        onSubmit={handleCreateTicket}
                        onCancel={() => setIsCreateOpen(false)}
                        isSubmitting={isCreating}
                        statuses={statuses}
                        priorities={priorities}
                        contracts={contracts}
                        mediaUnits={mediaUnits}
                        onContractChange={loadMediaUnits}
                        teams={teams}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
