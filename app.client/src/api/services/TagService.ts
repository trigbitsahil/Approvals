/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetTagListQueryResponse } from '../models/GetTagListQueryResponse';
import type { CreateTagIntermediateCommand } from '../models/CreateTagIntermediateCommand';
import type { UpdateTagIntermediateCommand } from '../models/UpdateTagIntermediateCommand';
import type { GetTagIntermediateListQueryResponse } from '../models/GetTagIntermediateListQueryResponse';
import type { DeleteTagIntermediateCommandResponse } from '../models/DeleteTagIntermediateCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TagService {
    /**
     * @param version 
     * @returns GetTagListQueryResponse Success
     * @throws ApiError
     */
    public static getTagList(
        version: string = '1',
    ): CancelablePromise<GetTagListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Tag',
            path: {
                'version': version,
            },
        });
    }

    /**
     * @param version 
     * @param category 
     * @param categoryId 
     * @returns GetTagIntermediateListQueryResponse Success
     * @throws ApiError
     */
    public static getTagIntermediateList(
        version: string = '1',
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetTagIntermediateListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TagIntermediate',
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
     * @returns any Success
     * @throws ApiError
     */
    public static postTagIntermediate(
        version: string = '1',
        requestBody?: CreateTagIntermediateCommand,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/TagIntermediate',
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
     * @returns any Success
     * @throws ApiError
     */
    public static putTagIntermediate(
        version: string = '1',
        requestBody?: UpdateTagIntermediateCommand,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/TagIntermediate',
            path: {
                'version': version,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id 
     * @param version 
     * @returns DeleteTagIntermediateCommandResponse Success
     * @throws ApiError
     */
    public static deleteTagIntermediate(
        id: string,
        version: string = '1',
    ): CancelablePromise<DeleteTagIntermediateCommandResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/TagIntermediate/{id}',
            path: {
                'id': id,
                'version': version,
            },
        });
    }
}
