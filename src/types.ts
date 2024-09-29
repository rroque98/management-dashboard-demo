export type PatientStatus = 'Inquiry' | 'Onboarding' | 'Active' | 'Churned';

export interface Patient {
  id: number;
  name: string;
  dob: string;
  status: PatientStatus;
  address: string;
}
