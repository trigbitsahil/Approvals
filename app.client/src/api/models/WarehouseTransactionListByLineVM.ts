/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WarehouseTransactionListByLineVM = {
    warehouseTransactionId?: string | null;
    warehouseId?: string | null;
    warehouseLocationId?: string | null;
    warehouseLocation?: string | null;
    qtyPickRec?: number;
    lineId?: string | null;
    orderHeaderId?: string | null;
    barcodeItemNum?: string | null;
    lotNum?: string | null;
    serialNum?: string | null;
    isIncrease?: boolean;
    increaseQty?: number;
    decreaseQty?: number;
    signedQty?: number;
    transactionDate?: string;
    issueLineId?: string | null;
    receiptLineId?: string | null;
    dataFrom2d?: string | null;
    recordedAt?: string;
    userEmail?: string | null;
    userModifiedEmail?: string | null;
    status?: string | null;
    dateMfg?: string | null;
    dateExp?: string | null;
    revisedQty?: number;
    isDepleted?: boolean;
    transId?: string | null;
    isVoided?: boolean;
    createdBy?: string | null;
    createdDate?: string;
    lastModifiedBy?: string | null;
    lastModifiedDate?: string | null;
};

