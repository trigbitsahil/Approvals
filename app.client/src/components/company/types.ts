// Assuming this is your types.ts file, ensure companySiteId is part of Company
export interface Company {
  companyId: string;
  companySiteId: string; // Ensure this is defined
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateId?: string;
  countryId?: string;
  zipCode?: string;
}

export interface CompanyFormData {
  companySiteId: string;
  companyId: string; // For form data, it's usually present if editing, but might be empty for new
  name: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateId: string;
  countryId: string;
  zipCode: string;
}

export interface Country {
  id: string;
  name: string;
}

export interface State {
  id: string;
  name: string;
  countryId: string;
}
