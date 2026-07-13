/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessTokenResponse } from '../models/AccessTokenResponse';
import type { ForgotPasswordRequest } from '../models/ForgotPasswordRequest';
import type { InfoRequest } from '../models/InfoRequest';
import type { InfoResponse } from '../models/InfoResponse';
import type { LoginRequest } from '../models/LoginRequest';
import type { RefreshRequest } from '../models/RefreshRequest';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { ResendConfirmationEmailRequest } from '../models/ResendConfirmationEmailRequest';
import type { ResetPasswordRequest } from '../models/ResetPasswordRequest';
import type { TwoFactorRequest } from '../models/TwoFactorRequest';
import type { TwoFactorResponse } from '../models/TwoFactorResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AppServerService {
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static postApiVIdentityRegister(
        requestBody?: RegisterRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/identity/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param useCookies
     * @param useSessionCookies
     * @param requestBody
     * @returns AccessTokenResponse Success
     * @throws ApiError
     */
    public static postApiVIdentityLogin(
        useCookies?: boolean,
        useSessionCookies?: boolean,
        requestBody?: LoginRequest,
    ): CancelablePromise<AccessTokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/identity/login',
            query: {
                'useCookies': useCookies,
                'useSessionCookies': useSessionCookies,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns AccessTokenResponse Success
     * @throws ApiError
     */
    public static postApiVIdentityRefresh(
        requestBody?: RefreshRequest,
    ): CancelablePromise<AccessTokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/identity/refresh',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param userId
     * @param code
     * @param changedEmail
     * @returns any Success
     * @throws ApiError
     */
    public static mapIdentityApiApiVVersionApiVersionIdentityConfirmEmail(
        userId?: string,
        code?: string,
        changedEmail?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/identity/confirmEmail',
            query: {
                'userId': userId,
                'code': code,
                'changedEmail': changedEmail,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static postApiVIdentityResendConfirmationEmail(
        requestBody?: ResendConfirmationEmailRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/identity/resendConfirmationEmail',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static postApiVIdentityForgotPassword(
        requestBody?: ForgotPasswordRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/identity/forgotPassword',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static postApiVIdentityResetPassword(
        requestBody?: ResetPasswordRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/identity/resetPassword',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns TwoFactorResponse Success
     * @throws ApiError
     */
    public static postApiVIdentityManage2Fa(
        requestBody?: TwoFactorRequest,
    ): CancelablePromise<TwoFactorResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/identity/manage/2fa',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }
    /**
     * @returns InfoResponse Success
     * @throws ApiError
     */
    public static getApiVIdentityManageInfo(): CancelablePromise<InfoResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/identity/manage/info',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns InfoResponse Success
     * @throws ApiError
     */
    public static postApiVIdentityManageInfo(
        requestBody?: InfoRequest,
    ): CancelablePromise<InfoResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/identity/manage/info',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }
}
