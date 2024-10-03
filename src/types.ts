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
  customFieldValues: {
    [customFieldId: string]: string | number | boolean | null;
  };
}

export type CustomFieldType = 'string' | 'number' | 'date' | 'boolean';

export interface CustomField {
  id: string;
  label: string;
  fieldType: CustomFieldType;
  required: boolean;
}
