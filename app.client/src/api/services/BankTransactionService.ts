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

    public static reverseBankTransaction(id: string): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: `/api/v1/BankTransaction/reverse/${id}`,
        });
    }
}
