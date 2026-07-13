/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateExpenseTransactionCommand = {
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
    approvalId?: string | null;
    isAdvance?: boolean;
    isDeposit?: boolean;
    budgetId?: string | null;
    IsApproved?: boolean;
    ExpenseAmountApproved?: number;

};

