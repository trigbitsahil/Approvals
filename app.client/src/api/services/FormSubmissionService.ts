/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateFormSubmissionCommand } from '../models/CreateFormSubmissionCommand';
import type { CreateFormSubmissionCommandResponse } from '../models/CreateFormSubmissionCommandResponse';
import type { DeleteFormSubmissionCommandResponse } from '../models/DeleteFormSubmissionCommandResponse';
import type { GetFormSubmissionDetailQueryResponse } from '../models/GetFormSubmissionDetailQueryResponse';
import type { GetFormSubmissionListQueryResponse } from '../models/GetFormSubmissionListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateFormSubmissionCommand } from '../models/UpdateFormSubmissionCommand';
import type { UpdateFormSubmissionCommandResponse } from '../models/UpdateFormSubmissionCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FormSubmissionService {
    /**
     * @param version
     * @returns GetFormSubmissionListQueryResponse Success
     * @throws ApiError
     */
    public static getApiVFormSubmission(
        version: string,
    ): CancelablePromise<GetFormSubmissionListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/FormSubmission',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateFormSubmissionCommandResponse Success
     * @throws ApiError
     */
    public static postApiVFormSubmission(
        version: string,
        requestBody?: CreateFormSubmissionCommand,
    ): CancelablePromise<CreateFormSubmissionCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/FormSubmission',
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
     * @returns UpdateFormSubmissionCommandResponse Success
     * @throws ApiError
     */
    public static putApiVFormSubmission(
        version: string,
        requestBody?: UpdateFormSubmissionCommand,
    ): CancelablePromise<UpdateFormSubmissionCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/FormSubmission',
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
     * @returns GetFormSubmissionDetailQueryResponse Success
     * @throws ApiError
     */
    public static getFormSubmissionById(
        id: string,
        version: string,
    ): CancelablePromise<GetFormSubmissionDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/FormSubmission/{id}',
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
     * @returns DeleteFormSubmissionCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteFormSubmission(
        id: string,
        version: string,
    ): CancelablePromise<DeleteFormSubmissionCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/FormSubmission/{id}',
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
