import { object, string, number, boolean } from "yup";

const InventoryValidationSchema = object().shape({
  ownerBarcodeItemNum: string().required("Owner Barcode/Item Num is required"),
  hasClientOption: boolean().default(false),
  productClientId: string().when("hasClientOption", {
    is: true,
    then: (schema) => schema.required("Product Client is required"),
    otherwise: (schema) => schema.nullable(),
  }),
  productDescription: string()
    .matches(/^[a-zA-Z0-9\s]+$/, "Description must contain only letters, numbers, and spaces")
    .required("Product Description is required"),
  productNotes: string().nullable(),
  productUom: string().required("UOM is required"),
  productGrossWeightKg: number()
    .typeError("Weight must be a number")
    .required("Weight is required"),
  productPackage: string().required("Package info is required"),
  lastPricePaid: number()
    .typeError("Price must be a number")
    .required("Price is required"),
  isLotRequired: boolean().default(false),
  isSnRequired: boolean().default(false),
  isDateMfgRequired: boolean().default(false),
  isDateExpRequired: boolean().default(false),
  isVoided: boolean().default(false),
});

export default InventoryValidationSchema;
