export interface CombinedBankTransactionVM {
    approvalId: string;
    approvalName: string;
    amount: number;
    fromBankName: string | null;
    toBankName: string | null;
    completedOn: string;
    runningBalanceBank1: number | null;
    runningBalanceBank2: number | null;
}
