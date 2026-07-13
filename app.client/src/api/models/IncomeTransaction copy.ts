/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type IncomeTransaction = {
    incomeTransactionId?: string | null;
    incomeId: string;
    incomeTypeId: string;
    name: string;
    description?: string | null;
    dateOfIncome: string;
    dateOfPayment?: string | null;
    incomeAmount: number;
    customerId?: string | null;
    category?: string | null;
    categoryId?: string | null;
    isCleared: boolean;
    isVoided: boolean;
    createdBy?: string | null;
    createdDate: string;
    lastModifiedBy?: string | null;
    lastModifiedDate?: string | null;
    tenantId: string;
    isApproved: boolean;
    approvedBy?: string | null;
    approvedDate?: string | null;
    approvalId?: string | null;
    isFinanceApprovalRequested: boolean;
    isFinanceApproved: boolean;
    financeApprovedBy?: string | null;
    financeApprovedDate?: string | null;
    financeApprovalId?: string | null;
    incomeAmountApproved?: number | null;
    isAdvance?: boolean | null;
    isDeposit?: boolean | null;
    depositReturnedDate?: string | null;
    depositReturnNotes?: string | null;
    budgetId?: string | null;
};

