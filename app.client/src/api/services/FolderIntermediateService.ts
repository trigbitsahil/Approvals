/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateFolderIntermediateCommand } from '../models/CreateFolderIntermediateCommand';
import type { CreateFolderIntermediateCommandResponse } from '../models/CreateFolderIntermediateCommandResponse';
import type { DeleteFolderIntermediateCommandResponse } from '../models/DeleteFolderIntermediateCommandResponse';
import type { GetFolderIntermediateDetailQueryResponse } from '../models/GetFolderIntermediateDetailQueryResponse';
import type { GetFolderIntermediateListQueryResponse } from '../models/GetFolderIntermediateListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateFolderIntermediateCommand } from '../models/UpdateFolderIntermediateCommand';
import type { UpdateFolderIntermediateCommandResponse } from '../models/UpdateFolderIntermediateCommandResponse';
import type { GetFolderIntermediateListByFolderQueryResponse } from '../models/GetFolderIntermediateListByFolderQueryResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FolderIntermediateService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetFolderIntermediateListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVFolderIntermediate(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetFolderIntermediateListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/FolderIntermediate',
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
     * @returns CreateFolderIntermediateCommandResponse Success
     * @throws ApiError
     */
    public static postApiVFolderIntermediate(
        version: string,
        requestBody?: CreateFolderIntermediateCommand,
    ): CancelablePromise<CreateFolderIntermediateCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/FolderIntermediate',
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
     * @returns UpdateFolderIntermediateCommandResponse Success
     * @throws ApiError
     */
    public static putApiVFolderIntermediate(
        version: string,
        requestBody?: UpdateFolderIntermediateCommand,
    ): CancelablePromise<UpdateFolderIntermediateCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/FolderIntermediate',
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
     * @returns GetFolderIntermediateDetailQueryResponse Success
     * @throws ApiError
     */
    public static getFolderIntermediateById(
        id: string,
        version: string,
    ): CancelablePromise<GetFolderIntermediateDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/FolderIntermediate/{id}',
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
     * @returns DeleteFolderIntermediateCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteFolderIntermediate(
        id: string,
        version: string,
    ): CancelablePromise<DeleteFolderIntermediateCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/FolderIntermediate/{id}',
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
       * @param folderId
       * @returns GetFolderIntermediateListByFolderQueryResponse Success
       * @throws ApiError
       */
    public static getFolderIntermediateListByFolder(
        version: string,
        folderId?: string,
    ): CancelablePromise<GetFolderIntermediateListByFolderQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/FolderIntermediate/GetFolderIntermediateListByFolder',
            path: {
                'version': version,
            },
            query: {
                'folderId': folderId,
            },
        });
    }
}
