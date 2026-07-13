/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ExpenseTransactionListForApprovalVM = {
    expenseTransactionID?: string | null;
    expenseId?: string | null;
    expenseTypeId?: string | null;
    name?: string | null;
    description?: string | null;
    dateOfExpense?: string;
    dateOfPayment?: string | null;
    expenseAmount?: number;
    vendorId?: string | null;
    category?: string | null;
    categoryID?: string | null;
    isCleared?: boolean;
    isVoided?: boolean;
    createdBy?: string | null;
    createdDate?: string;
    lastModifiedBy?: string | null;
    lastModifiedDate?: string | null;
    expenseName?: string | null;
    expenseTypeName?: string | null;
    isApproved?: boolean;
    approvedBy?: string | null;
    approvedDate?: string | null;
    approvalId?: string | null;
    isFinanceApprovalRequested?: boolean;
    isFinanceApproved?: boolean;
    financeApprovedBy?: string | null;
    financeApprovedDate?: string | null;
    financeApprovalId?: string | null;
    expenseAmountApproved?: number | null;
    requestedBy?: string | null;
    requestedDate?: string;
    priority?: string | null;
    approvalStatusName?: string | null;
    financeApprovalStatusName?: string | null;
    isAdvance?: boolean;
    isDeposit?: boolean;
    depositReturnedDate?: string | null;
    depositReturnNotes?: string | null;
    budgetId?: string | null;
};

