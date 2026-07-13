/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateDocumentUrlCommand } from '../models/CreateDocumentUrlCommand';
import type { CreateDocumentUrlCommandResponse } from '../models/CreateDocumentUrlCommandResponse';
import type { DeleteDocumentUrlCommandResponse } from '../models/DeleteDocumentUrlCommandResponse';
import type { GetDocumentSearchListQueryResponse } from '../models/GetDocumentSearchListQueryResponse';
import type { GetDocumentUrlDetailQueryResponse } from '../models/GetDocumentUrlDetailQueryResponse';
import type { GetDocumentUrlFileViewListQuery } from '../models/GetDocumentUrlFileViewListQuery';
import type { GetDocumentUrlFileViewListQueryResponse } from '../models/GetDocumentUrlFileViewListQueryResponse';
import type { GetDocumentUrlListByDocTypeQueryResponse } from '../models/GetDocumentUrlListByDocTypeQueryResponse';
import type { GetDocumentUrlListQueryResponse } from '../models/GetDocumentUrlListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateDocumentUrlCommand } from '../models/UpdateDocumentUrlCommand';
import type { UpdateDocumentUrlCommandResponse } from '../models/UpdateDocumentUrlCommandResponse';
import type { UpdateDocumentUrlTextCommand } from '../models/UpdateDocumentUrlTextCommand';
import type { UpdateDocumentUrlTextCommandResponse } from '../models/UpdateDocumentUrlTextCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DocumentsService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetDocumentUrlListQueryResponse OK
     * @throws ApiError
     */
    public static getApiVDocuments(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetDocumentUrlListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Documents',
            path: {
                'version': version,
            },
            query: {
                'category': category,
                'categoryId': categoryId,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateDocumentUrlCommandResponse OK
     * @throws ApiError
     */
    public static postApiVDocuments(
        version: string,
        requestBody?: CreateDocumentUrlCommand,
    ): CancelablePromise<CreateDocumentUrlCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Documents',
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
     * @returns UpdateDocumentUrlCommandResponse OK
     * @throws ApiError
     */
    public static putApiVDocuments(
        version: string,
        requestBody?: UpdateDocumentUrlCommand,
    ): CancelablePromise<UpdateDocumentUrlCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Documents',
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
     * @param docType
     * @param docTypeId
     * @returns GetDocumentUrlListByDocTypeQueryResponse OK
     * @throws ApiError
     */
    public static getDocumentListByType(
        version: string,
        docType?: string,
        docTypeId?: string,
    ): CancelablePromise<GetDocumentUrlListByDocTypeQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Documents/GetByType',
            path: {
                'version': version,
            },
            query: {
                'docType': docType,
                'docTypeId': docTypeId,
            },
        });
    }
    /**
     * @param version
     * @param searchText
     * @param categoryType
     * @param categoryTypeId
     * @returns GetDocumentSearchListQueryResponse OK
     * @throws ApiError
     */
    public static getDocumentBySearch(
        version: string,
        searchText?: string,
        categoryType?: string,
        categoryTypeId?: string,
    ): CancelablePromise<GetDocumentSearchListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Documents/SearchDocuments',
            path: {
                'version': version,
            },
            query: {
                'searchText': searchText,
                'categoryType': categoryType,
                'categoryTypeID': categoryTypeId,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
     * @param id
     * @param version
     * @returns GetDocumentUrlDetailQueryResponse OK
     * @throws ApiError
     */
    public static getDocumentUrlById(
        id: string,
        version: string,
    ): CancelablePromise<GetDocumentUrlDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Documents/{id}',
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
     * @param id
     * @param version
     * @returns DeleteDocumentUrlCommandResponse OK
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteDocumentUrl(
        id: string,
        version: string,
    ): CancelablePromise<DeleteDocumentUrlCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/Documents/{id}',
            path: {
                'id': id,
                'version': version,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
         * @param version
         * @param requestBody
         * @returns GetDocumentUrlFileViewListQueryResponse Success
         * @throws ApiError
         */
    public static getDocumentFileViewList(
        version: string,
        requestBody?: GetDocumentUrlFileViewListQuery,
    ): CancelablePromise<GetDocumentUrlFileViewListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Documents/GetDocumentFileViewList',
            path: {
                'version': version,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns UpdateDocumentUrlTextCommandResponse Success
     * @throws ApiError
     */
    public static updateDocumentPage(
        version: string,
        requestBody?: UpdateDocumentUrlTextCommand,
    ): CancelablePromise<UpdateDocumentUrlTextCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Documents/UpdateDocumentPage',
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
        * @returns GetDocumentUrlFileViewListQueryResponse Success
        * @throws ApiError
        */
    public static getDocumentFileViewList2(
        version: string,
        requestBody?: GetDocumentUrlFileViewListQuery,
    ): CancelablePromise<GetDocumentUrlFileViewListQueryResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Documents/GetDocumentFileViewList2',
            path: {
                'version': version,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
