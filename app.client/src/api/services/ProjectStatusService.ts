/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateProjectStatusCommand } from '../models/CreateProjectStatusCommand';
import type { CreateProjectStatusCommandResponse } from '../models/CreateProjectStatusCommandResponse';
import type { DeleteProjectStatusCommandResponse } from '../models/DeleteProjectStatusCommandResponse';
import type { GetProjectStatusDetailQueryResponse } from '../models/GetProjectStatusDetailQueryResponse';
import type { GetProjectStatusListQueryResponse } from '../models/GetProjectStatusListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateProjectStatusCommand } from '../models/UpdateProjectStatusCommand';
import type { UpdateProjectStatusCommandResponse } from '../models/UpdateProjectStatusCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProjectStatusService {
    /**
     * @param version
     * @returns GetProjectStatusListQueryResponse Success
     * @throws ApiError
     */
    public static projectStatusGet(
        version: string,
    ): CancelablePromise<GetProjectStatusListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ProjectStatus',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateProjectStatusCommandResponse Success
     * @throws ApiError
     */
    public static projectStatusPost(
        version: string,
        requestBody?: CreateProjectStatusCommand,
    ): CancelablePromise<CreateProjectStatusCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ProjectStatus',
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
     * @returns UpdateProjectStatusCommandResponse Success
     * @throws ApiError
     */
    public static projectStatusPut(
        version: string,
        requestBody?: UpdateProjectStatusCommand,
    ): CancelablePromise<UpdateProjectStatusCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ProjectStatus',
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
     * @returns GetProjectStatusDetailQueryResponse Success
     * @throws ApiError
     */
    public static getProjectStatusById(
        id: string,
        version: string,
    ): CancelablePromise<GetProjectStatusDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ProjectStatus/{id}',
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
     * @returns DeleteProjectStatusCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteProjectStatus(
        id: string,
        version: string,
    ): CancelablePromise<DeleteProjectStatusCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ProjectStatus/{id}',
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
