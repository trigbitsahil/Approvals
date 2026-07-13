/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateNoteCommand } from '../models/CreateNoteCommand';
import type { CreateNoteCommandResponse } from '../models/CreateNoteCommandResponse';
import type { DeleteNoteCommandResponse } from '../models/DeleteNoteCommandResponse';
import type { GetNoteDetailQueryResponse } from '../models/GetNoteDetailQueryResponse';
import type { GetNoteListQueryResponse } from '../models/GetNoteListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateNoteCommand } from '../models/UpdateNoteCommand';
import type { UpdateNoteCommandResponse } from '../models/UpdateNoteCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NoteService {
    /**
     * @param version
     * @param category
     * @param categoryId
     * @returns GetNoteListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVNote(
        version: string,
        category?: string,
        categoryId?: string,
    ): CancelablePromise<GetNoteListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Note',
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
     * @returns CreateNoteCommandResponse Success
     * @throws ApiError
     */
    public static postApiVNote(
        version: string,
        requestBody?: CreateNoteCommand,
    ): CancelablePromise<CreateNoteCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Note',
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
     * @returns UpdateNoteCommandResponse Success
     * @throws ApiError
     */
    public static putApiVNote(
        version: string,
        requestBody?: UpdateNoteCommand,
    ): CancelablePromise<UpdateNoteCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Note',
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
     * @returns GetNoteDetailQueryResponse Success
     * @throws ApiError
     */
    public static getNoteById(
        id: string,
        version: string,
    ): CancelablePromise<GetNoteDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Note/{id}',
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
     * @returns DeleteNoteCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteNote(
        id: string,
        version: string,
    ): CancelablePromise<DeleteNoteCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/Note/{id}',
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
