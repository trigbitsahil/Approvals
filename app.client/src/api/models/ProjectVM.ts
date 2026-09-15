export type ProjectVM = {
    projectId?: string | null;
    name?: string | null;
    description?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    status?: string | null;
    isActive?: boolean;
    isVoided?: boolean;
    createdBy?: string | null;
    createdDate?: string | null;
    lastModifiedBy?: string | null;
    lastModifiedDate?: string | null;
    statusName?: string | null;
    isPrivate?: boolean;
};
