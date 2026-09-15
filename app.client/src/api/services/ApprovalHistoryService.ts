import type { ApprovalHistoryVM } from '../models/ApprovalHistoryVM';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ApprovalHistoryService {
    public static getApprovalHistory(approvalId: string): CancelablePromise<{ success: boolean; data: ApprovalHistoryVM[]; message?: string }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/ApprovalHistory/{approvalId}',
            path: {
                'approvalId': approvalId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
            },
        }).then((res: any) => {
            if (Array.isArray(res)) {
                return { success: true, data: res };
            }
            return res;
        });
    }
}
