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
}
