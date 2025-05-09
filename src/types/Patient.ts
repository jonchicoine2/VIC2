export type PatientStatus = 'Active' | 'Discharged' | 'Pending';
export type Gender = 'Male' | 'Female' | 'Other';
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Patient {
  rowNumber: number;
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dob: Date;
  bloodType: BloodType;
  phone: string;
  email: string;
  address: string;
  diagnosis: string;
  admissionDate: Date;
  status: PatientStatus;
} 