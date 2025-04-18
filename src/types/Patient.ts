export type PatientStatus = 'Active' | 'Discharged' | 'Pending';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dob: Date;
  diagnosis: string;
  admissionDate: Date;
  status: PatientStatus;
} 