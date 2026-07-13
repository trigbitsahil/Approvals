/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateCompanyCommand = {
  companyId?: string | null; // Corrected property name to match API schema
  name?: string | null;
  description?: string | null;
  email?: string | null;
  // Added missing fields from CompanyFormData that might be part of the update command
  phone?: string | null;
  website?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  stateId?: string | null;
  countryId?: string | null;
  zipCode?: string | null;
  companySiteId?: string | null; // Assuming this is also part of the update
};
