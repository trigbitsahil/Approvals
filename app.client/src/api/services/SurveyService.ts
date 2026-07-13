import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export interface CreateSurveyCommand {
    mediaTypeId: string;
    inspectorEmail: string;
    surveyDate: string;
    weekNumber: number;
    weekNum?: string;
    status: string;
    structureStatus?: string;
    structureComments?: string;
    brandingStatus?: string;
    brandingComments?: string;
    powerStatus?: string;
    ledStatus?: string;
    brightnessStatus?: string;
    lightingIssueCategory?: string;
    lightingComments?: string;
    housekeepingScore?: number;
    housekeepingTags?: string[];
    housekeepingComments?: string;
    safetySeverity?: string;
    notifyOperations?: boolean;
    safetyComments?: string;
    compliancePercent?: number;
    issueCount?: number;
    remarks?: string;
}

export interface UpdateSurveyCommand extends CreateSurveyCommand {
    surveyId: string;
}

export interface SurveyListVM {
    surveyId: string;
    mediaTypeId: string;
    inspectorEmail: string;
    surveyDate: string;
    weekNumber: number;
    status: string;
    structureStatus?: string;
    brandingStatus?: string;
    powerStatus?: string;
    ledStatus?: string;
    brightnessStatus?: string;
    lightingIssueCategory?: string;
    housekeepingScore?: number;
    safetySeverity?: string;
    notifyOperations?: boolean;
    compliancePercent?: number;
    issueCount?: number;
    weekNum?: string;
    mediaUnitName?: string;
    mediaTypeName?: string;
    isVoided?: boolean;
    createdBy?: string;
    createdDate?: string;
    lastModifiedBy?: string;
    lastModifiedDate?: string;
}

export interface SurveyDetailVM extends SurveyListVM {
    structureComments?: string;
    brandingComments?: string;
    lightingComments?: string;
    housekeepingTags?: string[];
    housekeepingComments?: string;
    safetyComments?: string;
    remarks?: string;
}

export interface GetSurveyListQueryResponse {
    success: boolean;
    message?: string;
    validationErrors?: string[];
    data: SurveyListVM[];
}

export interface GetSurveyDetailQueryResponse {
    success: boolean;
    message?: string;
    validationErrors?: string[];
    data: SurveyDetailVM;
}

export interface CreateSurveyCommandResponse {
    success: boolean;
    message?: string;
    validationErrors?: string[];
    data: {
        surveyId: string;
        mediaTypeId: string;
        inspectorEmail: string;
    };
}

export interface UpdateSurveyCommandResponse {
    success: boolean;
    message?: string;
    validationErrors?: string[];
    data: {
        surveyId: string;
        mediaTypeId: string;
        inspectorEmail: string;
    };
}

export interface DeleteSurveyCommandResponse {
    success: boolean;
    message?: string;
    validationErrors?: string[];
}

export class SurveyService {
    public static getSurveys(version: string = '1.0'): CancelablePromise<GetSurveyListQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Survey',
            path: {
                'version': version,
            },
        });
    }

    public static getSurveyById(id: string, version: string = '1.0'): CancelablePromise<GetSurveyDetailQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Survey/{id}',
            path: {
                'id': id,
                'version': version,
            },
        });
    }

    public static createSurvey(requestBody: CreateSurveyCommand, version: string = '1.0'): CancelablePromise<CreateSurveyCommandResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Survey',
            path: {
                'version': version,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    public static updateSurvey(requestBody: UpdateSurveyCommand, version: string = '1.0'): CancelablePromise<UpdateSurveyCommandResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Survey',
            path: {
                'version': version,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    public static deleteSurvey(id: string, version: string = '1.0'): CancelablePromise<DeleteSurveyCommandResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/Survey/{id}',
            path: {
                'id': id,
                'version': version,
            },
        });
    }
}
