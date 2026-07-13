/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateOrderHeaderDto = {
    orderHeaderId?: string | null;
    warehouseId?: string | null;
    documentClientId?: string | null;
    orderTypeId?: string | null;
    clientOrderNum?: string | null;
    orderDate?: string;
    billToId?: string | null;
    shipFromName?: string | null;
    billToName?: string | null;
    shipToId?: string | null;
    shipToAttn?: string | null;
    shipToName?: string | null;
    shipToAddress1?: string | null;
    shipToAddress2?: string | null;
    shipToCity?: string | null;
    shipToState?: string | null;
    shipToZip?: string | null;
    shipToCountry?: string | null;
    shipToPhone?: string | null;
    poNum?: string | null;
    shipFreightTerms?: string | null;
    shipMethod?: string | null;
    customerOrderNum?: string | null;
    customerDueDate?: string;
    shipmentDeadline?: string;
    freightAcctNumber?: string | null;
    freightQuoteNum?: string | null;
    freightQuotedAmount?: number;
    shippingAndHandlingCharge?: number;
    receiptFromName?: string | null;
    receiptDeadline?: string;
    comments?: string | null;
    isShippedOrReceived?: boolean;
    dateShipped?: string;
    trackingNumber?: string | null;
    isClosed?: boolean;
    dateReceived?: string;
    matchesDocOrder?: boolean;
    picking?: boolean;
    receiving?: boolean;
    moving?: boolean;
    adjusting?: boolean;
    discrepancyDetail?: string | null;
    isPickedOrReceived?: boolean;
    isOverwritten?: boolean;
    isVoided?: boolean;
    createdBy?: string | null;
    createdDate?: string;
    lastModifiedBy?: string | null;
    lastModifiedDate?: string | null;
};
