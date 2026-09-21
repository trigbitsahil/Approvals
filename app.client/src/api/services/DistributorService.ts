/* generated manually - hits /distributor endpoint */
import type { DistributorListVM } from '../models/DistributorListVM';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DistributorService {
    public static getApiVDistributor(
        version: string = '1',
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: Array<DistributorListVM> | null;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Distributor',
            path: {
                'version': version,
            },
        });
    }
    public static getDistributorById(
        id: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: DistributorListVM | null;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Distributor/{id}',
            path: {
                'id': id,
            },
        });
    }

    public static getDistributorSummary(
        id: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: any;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Distributor/{id}/summary',
            path: {
                'id': id,
            },
        });
    }

    public static createDistributor(
        requestBody: any,
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: any;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/Distributor',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    public static updateDistributor(
        requestBody: any,
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: any;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/Distributor',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    public static deleteDistributor(
        id: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: any;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/Distributor/{id}',
            path: {
                'id': id,
            },
        });
    }
}
