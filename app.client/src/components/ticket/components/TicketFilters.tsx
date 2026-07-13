import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { DatePickerWithRange } from "./DatePickerWithRange";

interface TicketFiltersProps {
    filters: any;
    setFilter: (key: any, value: any) => void;
    clearFilters: () => void;
    statuses: Array<{ ticketStatusId: string; name: string }>;
    priorities: Array<{ ticketPriorityId: string; name: string }>;
    users?: Array<{ id: string; email: string }>;
}

export const TicketFilters = ({
    filters,
    setFilter,
    clearFilters,
    statuses,
    priorities,
    users = [],
}: TicketFiltersProps) => {
    return (
        <div className="flex flex-wrap gap-4 items-stretch md:items-center bg-muted/20 p-4 rounded-lg">
            <Input
                placeholder="Search tickets..."
                value={filters.search}
                onChange={(e) => setFilter("search", e.target.value)}
                className="w-full md:w-64"
            />

            <Select
                value={filters.statusId}
                onValueChange={(val) => setFilter("statusId", val)}
            >
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map(s => (
                        <SelectItem key={s.ticketStatusId} value={s.ticketStatusId}>
                            {s.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.priorityId}
                onValueChange={(val) => setFilter("priorityId", val)}
            >
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    {priorities.map(p => (
                        <SelectItem key={p.ticketPriorityId} value={p.ticketPriorityId}>
                            {p.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <DatePickerWithRange
                date={filters.dateRange}
                setDate={(range) => setFilter("dateRange", range || { from: undefined, to: undefined })}
                className="w-full md:w-[260px]"
            />

            <Select
                value={filters.assignedTo || "all"}
                onValueChange={(val) => setFilter("assignedTo", val)}
            >
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Assigned To" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Assignees</SelectItem>
                    {users.map(u => (
                        <SelectItem key={u.id} value={u.email}>
                            {u.email}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.requestedBy || "all"}
                onValueChange={(val) => setFilter("requestedBy", val)}
            >
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Recorded By" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Requested by</SelectItem>
                    {users.map(u => (
                        <SelectItem key={u.id} value={u.email}>
                            {u.email}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.isClientRequest}
                onValueChange={(val) => setFilter("isClientRequest", val)}
            >
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Client Request" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="yes">Client Requests Only</SelectItem>
                    <SelectItem value="no">Non-Client Requests</SelectItem>
                </SelectContent>
            </Select>


            <Button
                variant="ghost"
                onClick={clearFilters}
                className="w-full md:w-auto md:ml-auto text-muted-foreground border border-primary cursor-pointer hover:border-primary"
            >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
            </Button>
        </div>
    );
};
