/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateInventoryItemCommand = {
    inventoryItemId?: string | null;
    ownerBarcodeItemNum?: string | null;
    productClientId?: string | null;
    productDescription?: string | null;
    productNotes?: string | null;
    productUom?: string | null;
    productGrossWeightKg?: number;
    productPackage?: string | null;
    lastPricePaid?: number;
    isLotRequired?: boolean;
    isSnRequired?: boolean;
    isDateMfgRequired?: boolean;
    isDateExpRequired?: boolean;
    imageUrl?: string | null;
    inventoryItemTypeId?: string | null;
};
