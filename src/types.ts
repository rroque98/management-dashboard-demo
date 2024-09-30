export type PatientStatus = 'Inquiry' | 'Onboarding' | 'Active' | 'Churned';

export interface Address {
  id: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Patient {
  id: number;
  name: string;
  dob: string;
  status: PatientStatus;
  addresses: Address[];
}
