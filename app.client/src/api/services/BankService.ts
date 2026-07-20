import type { BankListVM } from '../models/BankListVM';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BankService {
    public static getBanks(): CancelablePromise<Array<BankListVM>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Bank',
        });
    }

    public static createBank(payload: any): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/Bank',
            body: payload,
        });
    }

    public static updateBank(payload: any): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/Bank',
            body: payload,
        });
    }

    public static deleteBank(id: string): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: `/api/v1/Bank/${id}`,
        });
    }
}
