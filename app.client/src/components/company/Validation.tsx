import * as yup from "yup";
import type { Company } from "./types"; // Import the Company type

export type CompanyFormData = Company;

export const companySchema = yup.object({
  companySiteId: yup.string().required("Company Site ID is required"),
  companyId: yup.string().required("Company ID is required"),
  name: yup.string().required("Company Name is required"),
  description: yup.string().optional(),
  email: yup.string().email("Invalid email format").optional(),
  phone: yup.string().optional(),
  website: yup
    .string()
    .url("Invalid URL format")
    .required("Website is required"),
  addressLine1: yup.string().optional(),
  addressLine2: yup.string().required("Address Line 2 is required"),
  city: yup.string().required("City is required"),
  stateId: yup.string().required("State is required"),
  countryId: yup.string().required("Country is required"),
  zipCode: yup.string().optional(),
});
