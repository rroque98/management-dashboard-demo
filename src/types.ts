export type PatientStatus = 'Inquiry' | 'Onboarding' | 'Active' | 'Churned';

export interface Address {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface Patient {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  status: PatientStatus;
  addresses: Address[];
  customFields?: Record<string, string | number>;
}

export type CustomFieldType = 'text' | 'number';

export interface CustomFieldConfig {
  name: string;
  label: string;
  type: CustomFieldType;
  required?: boolean;
}
