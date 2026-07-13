/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IncomeTransaction } from './IncomeTransaction';
export type GetIncomeTransactionListForApprovalQueryResponse = {
    success?: boolean;
    message?: string | null;
    validationErrors?: Array<string> | null;
    data?: Array<IncomeTransaction> | null;
};

