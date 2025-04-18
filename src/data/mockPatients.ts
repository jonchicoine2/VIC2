import { faker } from '@faker-js/faker';
import type { Patient, PatientStatus } from '../types/Patient';

const createRandomPatient = (): Patient => {
  const statusOptions: PatientStatus[] = ['Active', 'Discharged', 'Pending'];
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dob: faker.date.birthdate({ min: 18, max: 90, mode: 'age' }),
    diagnosis: faker.lorem.words(3),
    admissionDate: faker.date.past({ years: 2 }),
    status: faker.helpers.arrayElement(statusOptions),
  };
};

export const mockPatients: Patient[] = Array.from({ length: 100 }, createRandomPatient); 