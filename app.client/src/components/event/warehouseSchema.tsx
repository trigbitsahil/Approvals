import { object, string } from "yup";

const WarehouseValidationSchema = object().shape({
  warehouseCode: string()
    .matches(/^[0-9]+$/, "Warehouse Code must contain only numbers")
    .required("Warehouse Code is required"),

  warehouseName: string()
    .matches(/^[a-zA-Z\s]+$/, "Warehouse Name must contain only letters and spaces")
    .required("Warehouse Name is required"),

  warehouseAddressLine1: string()
    .required("Address Line 1 is required"),

  warehouseAddressLine2: string()
    .required("Address Line 2 is required"),

  warehouseCity: string()
    .matches(/^[a-zA-Z\s]+$/, "City must contain only letters")
    .required("City is required"),

  warehouseState: string()
    .matches(/^[a-zA-Z\s]+$/, "State must contain only letters")
    .required("State is required"),

  warehouseZip: string()
    .matches(/^[0-9]{5,6}$/, "Zip code must be 5 or 6 digits")
    .required("Zip Code is required"),

  warehouseCountry: string()
    .matches(/^[a-zA-Z\s]+$/, "Country must contain only letters")
    .required("Country is required"),

  warehousePhone: string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),

  warehouseFax: string()
    .matches(/^[0-9]{10}$/, "Fax number must be exactly 10 digits")
    .required("Fax number is required"),



  warehouseEmail: string()
    .email("Invalid email address format")
    .required("Email is required"),


});

export default WarehouseValidationSchema;