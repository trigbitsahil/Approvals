import type { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { getPriorityColor, getPriorityName } from "../utils/ticketHelpers";

interface PriorityBadgeProps {
    priorityId: string;
    priorities: Array<{ ticketPriorityId: string; name: string }>;
    className?: string;
}

export const PriorityBadge: FC<PriorityBadgeProps> = ({ priorityId, priorities, className }) => {
    return (
        <Badge
            variant="secondary"
            className={`${getPriorityColor(priorityId, priorities)} ${className || ""}`}
        >
            {getPriorityName(priorityId, priorities)}
        </Badge>
    );
};
