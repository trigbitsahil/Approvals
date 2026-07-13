import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class InvoicesService {
    /**
     * @param version
     * @returns any Success
     * @throws ApiError
     */
    public static getInvoices(
        version: string = '1.0',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Invoice',
            path: {
                'version': version,
            },
        });
    }

    /**
     * @param id
     * @param version
     * @returns any Success
     * @throws ApiError
     */
    public static getInvoiceById(
        id: string,
        version: string = '1.0',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Invoice/{id}',
            path: {
                'id': id,
                'version': version,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @param version
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static createInvoice(
        version: string = '1.0',
        requestBody?: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Invoice',
            path: {
                'version': version,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }

    /**
     * @param version
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static updateInvoice(
        version: string = '1.0',
        requestBody?: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Invoice',
            path: {
                'version': version,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }

    /**
     * @param id
     * @param version
     * @returns any Success
     * @throws ApiError
     */
    public static deleteInvoice(
        id: string,
        version: string = '1.0',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/Invoice/{id}',
            path: {
                'id': id,
                'version': version,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
