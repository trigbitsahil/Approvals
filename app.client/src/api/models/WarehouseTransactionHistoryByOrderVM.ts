/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WarehouseTransactionHistoryByOrderVM = {
    id?: string | null;
    barcode?: string | null;
    locationCode?: string | null;
    increaseQty?: number;
    decreaseQty?: number;
    isIncrease?: boolean;
    lotNum?: string | null;
    serialNum?: string | null;
    transactionDate?: string;
    signedQty?: number;
    runningBalance?: number;
    recordedAt?: string;
    dateMfg?: string | null;
    dateExp?: string | null;
    revisedQty?: number;
    billToName?: string | null;
    warehouseCode?: string | null;
    orderNum?: string | null;
    docType?: string | null;
    issueLineId?: string | null;
    receiptLineId?: string | null;
    userEmail?: string | null;
    isDepleted?: boolean;
    clientDocNum?: string | null;
    clientCode?: string | null;
    countable?: boolean;
};

