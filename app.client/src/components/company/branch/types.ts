// Branch/CompanySite types
export interface Branch {
  companySiteId: string
  companyId: string
  name: string
  description?: string
  email?: string
  phone?: string
  website?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  stateId?: string
  countryId?: string
  zipCode?: string
}

export interface BranchFormData {
  companySiteId: string
  companyId: string
  name: string
  description: string
  email: string
  phone: string
  website: string
  addressLine1: string
  addressLine2: string
  city: string
  stateId: string
  countryId: string
  zipCode: string
}

export interface Country {
  id: string
  name: string
}

export interface State {
  id: string
  name: string
  countryId: string
}
