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
  name: string;
  dob: string;
  status: PatientStatus;
  addresses: Address[];
}
