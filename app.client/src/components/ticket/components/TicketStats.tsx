import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, XCircle, Calendar, MessageSquare } from "lucide-react";
import { cn } from "@/utils/cn";

interface TicketStatsProps {
    stats: {
        total: { total: number; filtered: number };
        open: { total: number; filtered: number };
        inProgress: { total: number; filtered: number };
        resolved: { total: number; filtered: number };
        closed: { total: number; filtered: number };
        pastDeadline?: { total: number; filtered: number }; // Optional in case older version
    };
    onFilterByStatus: (statusId: string) => void;
    activeStatusFilter: string | "all";
    statuses: Array<{ ticketStatusId: string; name: string }>; // Needed for mapping
}

export const TicketStats = ({ stats, onFilterByStatus, activeStatusFilter, statuses }: TicketStatsProps) => {

    // Helper to find ID by partial name match or exact match
    const getStatusId = (namePart: string) => {
        if (namePart === "all") return "all";
        const found = statuses.find(s => s.name.toLowerCase().includes(namePart.toLowerCase()));
        return found ? found.ticketStatusId : namePart;
        // If not found, returning namePart might fail API, but better than nothing?
        // Ideally we should know the exact names from backend: "Open", "Resolved", "In Progress", "Closed"
    };

    const cards = [
        {
            label: "Open",
            value: `${stats.open.filtered} / ${stats.open.total}`,
            icon: AlertCircle, // Red icon
            color: "text-red-500",
            bgColor: "bg-transparent",
            statusFilter: "open",
            statusId: getStatusId("Open"),
        },
        {
            label: "In Progress",
            value: `${stats.inProgress.filtered} / ${stats.inProgress.total}`,
            icon: Clock, // Yellow icon
            color: "text-yellow-500",
            bgColor: "bg-transparent",
            statusFilter: "in-progress",
            statusId: getStatusId("Progress"),
        },
        {
            label: "Resolved",
            value: `${stats.resolved.filtered} / ${stats.resolved.total}`,
            icon: CheckCircle, // Green icon
            color: "text-green-500",
            bgColor: "bg-transparent",
            statusFilter: "resolved",
            statusId: getStatusId("Resolved"),
        },
        {
            label: "Past Deadline",
            value: `${stats.pastDeadline?.filtered || 0} / ${stats.pastDeadline?.total || 0}`,
            icon: Calendar, // Orange icon typically
            color: "text-orange-500",
            bgColor: "bg-transparent",
            statusFilter: "past-deadline",
            statusId: "past-deadline",
        },
        {
            label: "Total",
            value: `${stats.total.filtered} / ${stats.total.total}`,
            icon: MessageSquare, // Blue icon
            color: "text-blue-500",
            bgColor: "bg-transparent",
            statusFilter: "all",
            statusId: "all",
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {cards.map((card) => {
                // Check if active filter matches this card's ID
                const isSelected = activeStatusFilter === card.statusId;

                return (
                    <Card
                        key={card.label}
                        className={cn(
                            "cursor-pointer transition-all hover:shadow-md",
                            isSelected ? "ring-2 ring-primary border-primary" : ""
                        )}
                        onClick={() => onFilterByStatus(card.statusId)}
                    >
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                                <p className="text-2xl font-bold">{card.value}</p>
                            </div>
                            <div className={cn("p-2 rounded-full", card.bgColor)}>
                                <card.icon className={cn("h-8 w-8", card.color)} />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};
