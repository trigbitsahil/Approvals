import { useState, useEffect, useCallback } from "react";
import { TicketService } from "@/api/services/TicketService";
import type { TicketFiltersState } from "./useTicketFilters";

const API_VERSION = "1";

export const useTickets = (filters: TicketFiltersState) => {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const [stats, setStats] = useState({
        total: { total: 0, filtered: 0 },
        open: { total: 0, filtered: 0 },
        inProgress: { total: 0, filtered: 0 },
        resolved: { total: 0, filtered: 0 },
        closed: { total: 0, filtered: 0 },
        pastDeadline: { total: 0, filtered: 0 },
    });

    // Sorting State
    const [activeSortColumn, setActiveSortColumn] = useState<string>("ticketNo");
    const [sortOrder, setSortOrder] = useState<0 | 1>(0); // 0 = Asc, 1 = Desc
    const [sortType, setSortType] = useState<number>(0);

    const columnToSortType: Record<string, number> = {
        ticketNo: 0,
        title: 1,
        status: 2,
        priority: 3,
        createdBy: 4,
        departmentName: 5,
        createdDate: 6,
        deadlineDate: 6,
    };

    const handleSort = (column: string) => {
        const newSortType = columnToSortType[column];
        if (newSortType === undefined) return;

        if (activeSortColumn === column) {
            // Toggle order
            setSortOrder(prev => (prev === 0 ? 1 : 0));
        } else {
            // New column, default Asc
            setActiveSortColumn(column);
            setSortOrder(0);
            setSortType(newSortType);
        }
    };

    const fetchTickets = useCallback(
        async (showLoading = true) => {
            if (showLoading) setLoading(true);
            try {
                const query: any = {
                    pageNumber: pagination.pageIndex + 1,
                    pageSize: pagination.pageSize,
                    sortOrder: sortOrder.toString(),
                    sortType: sortType.toString(),
                };

                if (filters.search) query.searchText = filters.search;

                if (filters.statusId === "past-deadline") {
                    query.filterType = "PastDeadline";
                } else if (filters.statusId !== "all") {
                    query.ticketStatusId = filters.statusId;
                }

                if (filters.priorityId !== "all") query.ticketPriorityId = filters.priorityId;
                if (filters.departmentId !== "all") query.departmentId = filters.departmentId;
                if (filters.ticketTypeId !== "all") query.ticketTypeId = filters.ticketTypeId;
                if (filters.assignedTo !== "all") query.assignedTo = filters.assignedTo;
                if (filters.requestedBy !== "all") query.requestedBy = filters.requestedBy;
                if (filters.isClientRequest !== "all") {
                    query.isClientRequest = filters.isClientRequest === "yes";
                }

                if (filters.dateRange?.from) {
                    query.startDate = filters.dateRange.from.toISOString();
                }
                if (filters.dateRange?.to) {
                    query.endDate = filters.dateRange.to.toISOString();
                }

                // Removed string-based sortOrder assignment

                console.log("Fetching tickets with query:", query);

                const response = await TicketService.getTicketListByUser(API_VERSION, query);
                console.log("API Response:", response);

                // The API response type definition doesn't match the actual response.
                // Actual structure: { data: { ticketList: [], totalTickets: number, ... }, success: true }
                const responseData = (response as any).data;
                const items = responseData?.ticketList || [];
                const total = responseData?.filteredTotalTickets || responseData?.totalTickets || 0;

                // Update stats if available in response
                if (responseData) {
                    setStats({
                        total: { total: responseData.totalTickets || 0, filtered: responseData.filteredTotalTickets || 0 },
                        open: { total: responseData.openTickets || 0, filtered: responseData.filteredOpenTickets || 0 },
                        inProgress: { total: responseData.inprogressTickets || 0, filtered: responseData.filteredInprogressTickets || 0 },
                        resolved: { total: responseData.resolvedTickets || 0, filtered: responseData.filteredResolvedTickets || 0 },
                        closed: { total: responseData.completedTickets || 0, filtered: responseData.filteredCompletedTickets || 0 },
                        pastDeadline: { total: responseData.pastDeadlineDate || 0, filtered: responseData.filteredPastDeadlineDate || 0 },
                    });
                }

                setTickets(items);
                setTotalCount(total);

            } catch (error) {
                console.error("Failed to fetch tickets:", error);
                setTickets([]);
            } finally {
                if (showLoading) setLoading(false);
            }
        },
        [pagination.pageIndex, pagination.pageSize, filters, sortOrder, sortType]
    );

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const goToPage = (pageIndex: number) => {
        setPagination((prev) => ({ ...prev, pageIndex }));
    };

    return {
        tickets,
        loading,
        totalCount,
        pagination,
        setPagination,
        goToPage,
        stats,
        activeSortColumn,
        sortOrder,
        handleSort,
        refetch: fetchTickets,
    };
};
