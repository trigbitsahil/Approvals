/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateProjectCommand } from '../models/CreateProjectCommand';
import type { CreateProjectCommandResponse } from '../models/CreateProjectCommandResponse';
import type { DeleteProjectCommandResponse } from '../models/DeleteProjectCommandResponse';
import type { GetProjectDetailQueryResponse } from '../models/GetProjectDetailQueryResponse';
import type { GetProjectListQueryResponse } from '../models/GetProjectListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateProjectCommand } from '../models/UpdateProjectCommand';
import type { UpdateProjectCommandResponse } from '../models/UpdateProjectCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProjectService {
    /**
     * @param version
     * @returns GetProjectListQueryResponse Success
     * @throws ApiError
     */
    public static projectGet(
        version: string,
    ): CancelablePromise<GetProjectListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Project',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateProjectCommandResponse Success
     * @throws ApiError
     */
    public static projectPost(
        version: string,
        requestBody?: CreateProjectCommand,
    ): CancelablePromise<CreateProjectCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Project',
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
     * @returns UpdateProjectCommandResponse Success
     * @throws ApiError
     */
    public static projectPut(
        version: string,
        requestBody?: UpdateProjectCommand,
    ): CancelablePromise<UpdateProjectCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Project',
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
     * @returns GetProjectDetailQueryResponse Success
     * @throws ApiError
     */
    public static getProjectById(
        id: string,
        version: string,
    ): CancelablePromise<GetProjectDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Project/{id}',
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
     * @returns DeleteProjectCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteProject(
        id: string,
        version: string,
    ): CancelablePromise<DeleteProjectCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/Project/{id}',
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
