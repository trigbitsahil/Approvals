/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Approval } from './Approval';
import type { ExpenseTransaction } from './ExpenseTransaction';
import type { Letter } from './Letter';
import type { LetterDraft } from './LetterDraft';
import type { OfficeNote } from './OfficeNote';
import type { UpdateApprovalApproverDto } from './UpdateApprovalApproverDto';
export type UpdateApprovalApproverCommandResponse = {
    success?: boolean;
    message?: string | null;
    validationErrors?: Array<string> | null;
    data?: UpdateApprovalApproverDto;
    isLetterCreated?: boolean;
    letter?: Letter;
    letterDraft?: LetterDraft;
    letterSignatureImageUrl?: string | null;
    approval?: Approval;
    officeNote?: OfficeNote;
    expenseTransaction?: ExpenseTransaction;
};

