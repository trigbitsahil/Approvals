/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExpenseTransaction } from './ExpenseTransaction';
export type GetExpenseTransactionListForApprovalQueryResponse = {
    success?: boolean;
    message?: string | null;
    validationErrors?: Array<string> | null;
    data?: Array<ExpenseTransaction> | null;
};

