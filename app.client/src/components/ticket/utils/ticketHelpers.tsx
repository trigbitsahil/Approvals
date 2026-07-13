import React from "react";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react";

export const getPriorityName = (
    priorityId: string,
    priorities: Array<{ ticketPriorityId: string; name: string }>
) => {
    const priority = priorities.find((p) => p.ticketPriorityId === priorityId);
    return priority?.name || priorityId;
};

export const getStatusName = (
    statusId: string,
    statuses: Array<{ ticketStatusId: string; name: string }>
) => {
    const status = statuses.find((s) => s.ticketStatusId === statusId);
    return status?.name || statusId;
};

export const getTypeName = (
    typeId: string,
    types: Array<{ ticketTypeId: string; name: string; ticketTypeName?: string }>
) => {
    const type = types.find((t) => (t.ticketTypeName || t.ticketTypeId) === typeId);
    return type?.name || typeId;
};

export const getContractName = (
    contractId: string,
    contracts: Array<{ contractId: string; name: string }>
) => {
    const contract = contracts.find((c) => c.contractId === contractId);
    return contract?.name || "Unknown Contract";
};

export const getMediaUnitName = (
    mediaUnitId: string,
    mediaUnits: Array<{ contractMediaUnitId: string; name: string }>
) => {
    const mediaUnit = mediaUnits.find(
        (m) => m.contractMediaUnitId === mediaUnitId
    );
    return mediaUnit?.name || "Unknown Media Unit";
};

export const getStatusIcon = (
    statusId: string,
    statuses: Array<{ ticketStatusId: string; name: string }>
) => {
    const statusName = getStatusName(statusId, statuses).toLowerCase();
    switch (statusName) {
        case "open":
            return <AlertCircle className="h-4 w-4" />;
        case "in-progress":
        case "in progress":
            return <Clock className="h-4 w-4" />;
        case "resolved":
            return <CheckCircle className="h-4 w-4" />;
        case "closed":
            return <XCircle className="h-4 w-4" />;
        default:
            return <AlertCircle className="h-4 w-4" />;
    }
};

export const getStatusColor = (
    statusId: string,
    statuses: Array<{ ticketStatusId: string; name: string }>
) => {
    const statusName = getStatusName(statusId, statuses).toLowerCase();
    switch (statusName) {
        case "open":
            return "bg-red-100 text-red-800 hover:bg-red-100";
        case "in-progress":
        case "in progress":
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
        case "resolved":
            return "bg-green-100 text-green-800 hover:bg-green-100";
        case "closed":
            return "bg-gray-100 text-gray-800 hover:bg-gray-100";
        default:
            return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    }
};

export const getPriorityColor = (
    priorityId: string,
    priorities: Array<{ ticketPriorityId: string; name: string }>
) => {
    const priorityName = getPriorityName(priorityId, priorities).toLowerCase();
    switch (priorityName) {
        case "low":
            return "bg-blue-100 text-blue-800 hover:bg-blue-100";
        case "medium":
            return "bg-orange-100 text-orange-800 hover:bg-orange-100";
        case "high":
            return "bg-red-100 text-red-800 hover:bg-red-100";
        case "urgent":
            return "bg-purple-100 text-purple-800 hover:bg-purple-100";
        default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
};

export const getDepartmentName = (deptId: string) => {
    const map: Record<string, string> = {
        "Dep_2025_04_05de41fe70-a071-41b9-9529-dbb46ed122e0":
            "Operations Department",
        "Dep_2025_08_0131badf7b-5ae7-4f76-abb8-dfca79eac03d": "HR Department",
    };
    return map[deptId] || "Unknown Department";
};
