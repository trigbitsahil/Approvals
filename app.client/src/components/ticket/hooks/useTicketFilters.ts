import { useState, useMemo } from "react";

export interface TicketFiltersState {
    search: string;
    statusId: string | "all";
    priorityId: string | "all";
    departmentId: string | "all";
    ticketTypeId: string | "all";
    assignedTo: string | "all";
    requestedBy: string | "all";
    isClientRequest: "all" | "yes" | "no";
    dateRange: { from: Date | undefined; to: Date | undefined };
}

export const useTicketFilters = () => {
    const [filters, setFilters] = useState<TicketFiltersState>({
        search: "",
        statusId: "all",
        priorityId: "all",
        departmentId: "all",
        ticketTypeId: "all",
        assignedTo: "all",
        requestedBy: "all",
        isClientRequest: "all",
        dateRange: { from: undefined, to: undefined },
    });

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.statusId !== "all") count++;
        if (filters.priorityId !== "all") count++;
        if (filters.departmentId !== "all") count++;
        if (filters.ticketTypeId !== "all") count++;
        if (filters.assignedTo !== "all") count++;
        if (filters.requestedBy !== "all") count++;
        if (filters.isClientRequest !== "all") count++;
        if (filters.dateRange.from || filters.dateRange.to) count++;
        return count;
    }, [filters]);

    const setFilter = (key: keyof TicketFiltersState, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            statusId: "all",
            priorityId: "all",
            departmentId: "all",
            ticketTypeId: "all",
            assignedTo: "all",
            requestedBy: "all",
            isClientRequest: "all",
            dateRange: { from: undefined, to: undefined },
        });
    };

    return {
        filters,
        setFilter,
        clearFilters,
        activeFilterCount,
    };
};
