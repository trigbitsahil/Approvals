export type BankListVM = {
    bankId: string;
    name: string;
    type?: string | null;
    description?: string | null;
    address?: string | null;
    userId?: string | null;
    status?: string | null;
    isActive?: boolean;
    runningBalance: number;
};
