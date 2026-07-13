/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ExpenseTransaction = {
    expenseTransactionId?: string | null;
    expenseId: string;
    expenseTypeId: string;
    name: string;
    description?: string | null;
    dateOfExpense: string;
    dateOfPayment?: string | null;
    expenseAmount: number;
    vendorId?: string | null;
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
    expenseAmountApproved?: number | null;
    isAdvance?: boolean | null;
    isDeposit?: boolean | null;
    depositReturnedDate?: string | null;
    depositReturnNotes?: string | null;
    budgetId?: string | null;
};

