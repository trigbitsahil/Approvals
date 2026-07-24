import type { VendorCategoryListVM } from '../models/VendorCategoryListVM';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class VendorCategoryService {
    public static getAllVendorCategories(): CancelablePromise<Array<VendorCategoryListVM>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/VendorCategory',
        });
    }

    public static createVendorCategory(
        requestBody: any,
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: any;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/VendorCategory',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    public static updateVendorCategory(
        requestBody: any,
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: any;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/VendorCategory',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    public static deleteVendorCategory(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/VendorCategory/{id}',
            path: {
                'id': id,
            },
        });
    }
}
