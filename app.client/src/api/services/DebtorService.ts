/* generated manually - hits /debtor endpoint */
import type { DebtorListVM } from '../models/DebtorListVM';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DebtorService {
    public static getApiVDebtor(
        version: string = '1',
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: Array<DebtorListVM> | null;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Debtor',
            path: {
                'version': version,
            },
        });
    }
    public static getDebtorById(
        id: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: DebtorListVM | null;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Debtor/{id}',
            path: {
                'id': id,
            },
        });
    }

    public static createDebtor(
        requestBody: any,
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: any;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/Debtor',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    public static updateDebtor(
        requestBody: any,
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: any;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/Debtor',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    public static deleteDebtor(
        id: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: any;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/Debtor/{id}',
            path: {
                'id': id,
            },
        });
    }
}
