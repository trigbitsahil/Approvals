/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateCustomerQuoteLineDto = {
    customerQuoteLineId?: string | null;
    customerQuoteId?: string | null;
    lineTypeId?: string | null;
    lineId?: string | null;
    priceValue?: number;
    priceMethodId?: string | null;
    lineDescription?: string | null;
    customerPartRefNum?: string | null;
    doesPriceExpire?: boolean;
    expirationDate?: string;
    displayOnQuote?: boolean;
    displayOnOrder?: boolean;
    displayOnShipDoc?: boolean;
    quoteToOrderQty?: number;
    isExpired?: boolean;
    isVoided?: boolean;
    createdBy?: string | null;
    createdDate?: string;
    lastModifiedBy?: string | null;
    lastModifiedDate?: string | null;
};

