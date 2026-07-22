export type BankTransactionListVM = {
    transactionId?: string;
    bankId?: string;
    bankName?: string;
    approvalId?: string;
    approvalName?: string;
    transactionType?: string;
    amount: number;
    deposit: number;
    withdrawal: number;
    runningBalance: number;
    createdDate?: string;
    createdBy?: string;
};
