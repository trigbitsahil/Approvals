import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class InvoiceLinesService {
    /**
     * @param invoiceId
     * @param version
     * @returns any Success
     * @throws ApiError
     */
    public static getInvoiceLines(
        invoiceId: string,
        version: string = '1.0',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/InvoiceLine',
            path: {
                'version': version,
            },
            query: {
                'invoiceId': invoiceId,
            },
        });
    }

    /**
     * @param id
     * @param version
     * @returns any Success
     * @throws ApiError
     */
    public static getInvoiceLineById(
        id: string,
        version: string = '1.0',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/InvoiceLine/{id}',
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
    public static createInvoiceLine(
        version: string = '1.0',
        requestBody?: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/InvoiceLine',
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
    public static updateInvoiceLine(
        version: string = '1.0',
        requestBody?: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/InvoiceLine',
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
    public static deleteInvoiceLine(
        id: string,
        version: string = '1.0',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/InvoiceLine/{id}',
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
