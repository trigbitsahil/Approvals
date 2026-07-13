/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateIncomeTransactionCommand = {
    incomeTransactionID?: string | null;
    incomeId?: string | null;
    incomeTypeId?: string | null;
    name?: string | null;
    description?: string | null;
    dateOfIncome?: string;
    dateOfPayment?: string | null;
    incomeAmount?: number;
    customerId?: string | null;
    category?: string | null;
    categoryID?: string | null;
    isCleared?: boolean;
    isFinanceApprovalRequested?: boolean | null;
    isFinanceApproved?: boolean | null;
    financeApprovedBy?: string | null;
    financeApprovedDate?: string | null;
    financeApprovalId?: string | null;
    incomeAmountApproved?: number | null;
    isAdvance?: boolean;
    isDeposit?: boolean;
    depositReturnedDate?: string | null;
    depositReturnNotes?: string | null;
    budgetId?: string | null;
};

