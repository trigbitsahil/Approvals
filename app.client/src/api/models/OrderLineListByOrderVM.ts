/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrderLineListByOrderVM = {
    orderLineId?: string | null;
    orderHeaderId?: string | null;
    orderLineNum?: string | null;
    barcodeItemNum?: string | null;
    lineDescription?: string | null;
    orderIncQty?: number;
    orderDecQty?: number;
    unitOfMeasure?: string | null;
    dateTimeVoided?: string;
    partNum?: string | null;
    isInvalid?: boolean;
    isMatch?: boolean;
    inTransaction?: boolean;
    barcodeItem?: any;
    isVoided?: boolean;
    createdBy?: string | null;
    createdDate?: string;
    lastModifiedBy?: string | null;
    lastModifiedDate?: string | null;
};
