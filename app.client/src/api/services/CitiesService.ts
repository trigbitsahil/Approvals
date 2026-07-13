/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCityCommand } from '../models/CreateCityCommand';
import type { CreateCityCommandResponse } from '../models/CreateCityCommandResponse';
import type { DeleteCityCommandResponse } from '../models/DeleteCityCommandResponse';
import type { GetCityDetailQueryResponse } from '../models/GetCityDetailQueryResponse';
import type { GetCityListQueryResponse } from '../models/GetCityListQueryResponse';
import type { ProblemDetails } from '../models/ProblemDetails';
import type { UpdateCityCommand } from '../models/UpdateCityCommand';
import type { UpdateCityCommandResponse } from '../models/UpdateCityCommandResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CitiesService {
    /**
     * @param version
     * @returns GetCityListQueryResponse Success
     * @throws ApiError
     */
    public static getCityList(
        version: string,
    ): CancelablePromise<GetCityListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/cities',
            path: {
                'version': version,
            },
        });
    }
    /**
     * @param version
     * @param requestBody
     * @returns CreateCityCommandResponse Success
     * @throws ApiError
     */
    public static postApiVCities(
        version: string,
        requestBody?: CreateCityCommand,
    ): CancelablePromise<CreateCityCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/cities',
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
     * @returns UpdateCityCommandResponse Success
     * @throws ApiError
     */
    public static putApiVCities(
        version: string,
        requestBody?: UpdateCityCommand,
    ): CancelablePromise<UpdateCityCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/cities',
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
     * @returns GetCityDetailQueryResponse Success
     * @throws ApiError
     */
    public static getByCityId(
        id: string,
        version: string,
    ): CancelablePromise<GetCityDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/cities/{id}',
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
     * @returns DeleteCityCommandResponse Success
     * @returns ProblemDetails Error
     * @throws ApiError
     */
    public static deleteCity(
        id: string,
        version: string,
    ): CancelablePromise<DeleteCityCommandResponse | ProblemDetails> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/cities/{id}',
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
