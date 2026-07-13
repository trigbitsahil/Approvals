/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DocumentUrlTag } from './DocumentUrlTag';
import type { DocumentUrlTextVM } from './DocumentUrlTextVM';
export type DocumentUrlFileViewListVM = {
    documentUrlID?: string | null;
    name?: string | null;
    description?: string | null;
    isStared?: boolean;
    category?: string | null;
    categoryID?: string | null;
    documentFileName?: string | null;
    documentType?: string | null;
    documentTypeID?: string | null;
    blobUrl?: string | null;
    extension?: string | null;
    fileSizeBytes?: number;
    isHyperlinkAndNotFile?: boolean;
    isMarkedToDelete?: boolean;
    isVoided?: boolean;
    createdBy?: string | null;
    createdDate?: string;
    lastModifiedBy?: string | null;
    lastModifiedDate?: string | null;
    documentDate?: string | null;
    documentPageDetailList?: Array<DocumentUrlTextVM> | null;
    tags?: Array<DocumentUrlTag> | null;
};

