import type { ProjectVM } from '../models/ProjectVM';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ProjectService {
    public static getProjects(
        version: string = '1',
    ): CancelablePromise<{
        success?: boolean;
        message?: string | null;
        data?: Array<ProjectVM> | null;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Project',
            path: {
                'version': version,
            },
        });
    }
}
