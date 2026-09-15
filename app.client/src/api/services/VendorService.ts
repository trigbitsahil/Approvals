/* generated manually - hits /vendor endpoint */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VendorListVM } from '../models/VendorListVM';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class VendorService {
    /**
     * @param version
     * @returns any Success
     * @throws ApiError
     */
    public static getApiVVendor(
        version: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: Array<VendorListVM> | null;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Vendor',
            path: {
                'version': version,
            },
        });
    }
    public static getVendorById(
        id: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: VendorListVM | null;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Vendor/{id}',
            path: {
                'id': id,
            },
        });
    }

    public static getVendorSummary(
        id: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: {
            vendorId?: string;
            totalPaidAmount?: number;
            pendingAmount?: number;
            totalTransactionsCount?: number;
        } | null;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Vendor/{id}/summary',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static createVendor(
        requestBody: any,
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: any;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/Vendor',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static updateVendor(
        requestBody: any,
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: any;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/Vendor',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static deleteVendor(
        id: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: any;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/Vendor/{id}',
            path: {
                'id': id,
            },
        });
    }
}
