export interface CombinedBankTransactionVM {
    approvalId: string;
    approvalName: string;
    approvalReference?: string;
    amount: number;
    fromBankName: string | null;
    toBankName: string | null;
    completedOn: string;
    approvalType?: string;
    runningBalanceBank1: number | null;
    runningBalanceBank2: number | null;
}
