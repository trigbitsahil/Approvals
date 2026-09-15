import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import type { CancelablePromise } from '../core/CancelablePromise';


export class BankTransactionService {
    public static getAllBankTransactions(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/BankTransaction',
        });
    }

    public static getBankTransactionsByBankId(id: string): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: `/api/v1/BankTransaction/${id}`,
        });
    }

    public static getBankTransactionsByDistributorId(id: string, status?: string): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: `/api/v1/BankTransaction/distributor/${id}`,
            query: status && status !== 'all' ? { status } : undefined,
        });
    }

    public static getBankTransactionsByDebtorId(id: string, status?: string): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: `/api/v1/BankTransaction/debtor/${id}`,
            query: status && status !== 'all' ? { status } : undefined,
        });
    }

    public static getBankTransactionsByVendorId(id: string): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: `/api/v1/BankTransaction/vendor/${id}`,
        });
    }

    public static getCombinedBankTransactions(approvalType?: string): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/BankTransaction/AllBankTransactions',
            query: approvalType && approvalType !== 'all' ? { approvalType } : undefined,
        });
    }

    public static reverseBankTransaction(id: string): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: `/api/v1/BankTransaction/reverse/${id}`,
        });
    }

    public static getPendingBankTransactions(approvalType?: string): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/BankTransaction/pending',
            query: approvalType && approvalType !== 'all' ? { approvalType } : undefined,
        });
    }

    public static payDistributor(transactionId: string): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/BankTransaction/pay-distributor',
            body: { transactionId },
            mediaType: 'application/json',
        });
    }

    public static confirmTransaction(transactionId: string, remarks?: string): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/BankTransaction/confirm',
            body: { transactionId, remarks },
            mediaType: 'application/json',
        });
    }
}

