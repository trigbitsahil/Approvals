
import * as yup from "yup";

export const orderHeaderSchema = yup.object({
  clientOrderNum: yup.string().required("Client Order Number is required").nullable(),
  orderDate: yup.string().required("Order Date is required").nullable(),
  shipToAttention: yup.string().matches(/^[^0-9]*$/, "Numbers are not allowed in this field").optional().nullable(),
  shipToName: yup.string().matches(/^[^0-9]*$/, "Numbers are not allowed in this field").optional().nullable(),

  shipToAddress1: yup.string().optional().nullable(),
  shipToAddress2: yup.string().optional().nullable(),
  shipToCity: yup.string().matches(/^[^0-9]*$/, "Numbers are not allowed in this field").optional().nullable(),
  shipToState: yup.string().matches(/^[^0-9]*$/, "Numbers are not allowed in this field").optional().nullable(),

  shipToZip: yup.string().optional().nullable(),
  shipToCountry: yup.string().matches(/^[^0-9]*$/, "Numbers are not allowed in this field").optional().nullable(),
  shipToPhone: yup.string().matches(/^[0-9\s\-+()]*$/, "Must be a valid phone number").optional().nullable(),
  poNum: yup.string().optional().nullable(),

  freightTerms: yup.string().optional().nullable(),
  shipMethod: yup.string().optional().nullable(),
  dueDate: yup.string().optional().nullable(),
  shipmentDeadline: yup.string().optional().nullable(),

  freightAcc: yup.string().optional().nullable(),
  freightQuote: yup.string().optional().nullable(),
  freightQuoteAmount: yup.number().typeError("Must be a number").optional().nullable(),
  shippingCharges: yup.number().typeError("Must be a number").optional().nullable(),

  receiptFromName: yup.string().matches(/^[^0-9]*$/, "Numbers are not allowed in this field").optional().nullable(),
  receiptDeadline: yup.string().optional().nullable(),
  comments: yup.string().optional().nullable(),
  discrepancyDetail: yup.string().optional().nullable(),

  // Internal/Required for API
  warehouseId: yup.string().required("Warehouse is required").nullable(),
  orderTypeId: yup.string().required("Order Type is required").nullable(),
  documentClientId: yup.string().required("Document Client ID is required").nullable(),
  custOrderNum: yup.string().optional().nullable(),
  
  // Work Order Specific Fields
  increasedItemNum: yup.string().optional().nullable(),
  increasedItemQty: yup.number().typeError("Must be a number").optional().nullable(),
  increasedItemUnits: yup.string().optional().nullable(),
});

export type OrderHeaderFormData = yup.InferType<typeof orderHeaderSchema>;
