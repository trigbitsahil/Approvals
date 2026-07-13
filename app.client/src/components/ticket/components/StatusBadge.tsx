import type { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { getStatusIcon, getStatusColor, getStatusName } from "../utils/ticketHelpers";

interface StatusBadgeProps {
    statusId: string;
    statuses: Array<{ ticketStatusId: string; name: string }>;
    className?: string;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ statusId, statuses, className }) => {
    return (
        <Badge
            variant="secondary"
            className={`${getStatusColor(statusId, statuses)} flex items-center gap-1 ${className || ""}`}
        >
            {getStatusIcon(statusId, statuses)}
            {getStatusName(statusId, statuses)}
        </Badge>
    );
};
