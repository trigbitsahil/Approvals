/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateExpenseTransactionCommand = {
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
    isFinanceApprovalRequested?: boolean | null;
    isFinanceApproved?: boolean | null;
    financeApprovedBy?: string | null;
    financeApprovedDate?: string | null;
    financeApprovalId?: string | null;
    expenseAmountApproved?: number | null;
    isAdvance?: boolean;
    isDeposit?: boolean;
    depositReturnedDate?: string | null;
    depositReturnNotes?: string | null;
    budgetId?: string | null;
};

