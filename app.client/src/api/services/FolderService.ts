/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateFolderCommand } from '../models/CreateFolderCommand';
import type { CreateFolderCommandResponse } from '../models/CreateFolderCommandResponse';
import type { DeleteFolderCommandResponse } from '../models/DeleteFolderCommandResponse';
import type { GetFolderDetailQueryResponse } from '../models/GetFolderDetailQueryResponse';
import type { GetFolderListQueryResponse } from '../models/GetFolderListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateFolderCommand } from '../models/UpdateFolderCommand';
import type { UpdateFolderCommandResponse } from '../models/UpdateFolderCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FolderService {
    /**
     * @param version
     * @returns GetFolderListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVFolder(
        version: string,
    ): CancelablePromise<GetFolderListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Folder',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateFolderCommandResponse Success
     * @throws ApiError
     */
    public static postApiVFolder(
        version: string,
        requestBody?: CreateFolderCommand,
    ): CancelablePromise<CreateFolderCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Folder',
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
     * @returns UpdateFolderCommandResponse Success
     * @throws ApiError
     */
    public static putApiVFolder(
        version: string,
        requestBody?: UpdateFolderCommand,
    ): CancelablePromise<UpdateFolderCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Folder',
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
     * @returns GetFolderDetailQueryResponse Success
     * @throws ApiError
     */
    public static getFolderById(
        id: string,
        version: string,
    ): CancelablePromise<GetFolderDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Folder/{id}',
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
     * @returns DeleteFolderCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteFolder(
        id: string,
        version: string,
    ): CancelablePromise<DeleteFolderCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/Folder/{id}',
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
