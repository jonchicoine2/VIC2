import { faker } from '@faker-js/faker';
import type { Patient, PatientStatus, Gender, BloodType } from '../types/Patient';

// Helper to create a formatted phone number like the ones in the screenshot
const createFormattedPhone = () => {
  // Create patterns like: 1-517-369-4962, 436-450-6849, etc.
  const formats = [
    '###-###-####',
    '#-###-###-####',
    '###.###.#### x###'
  ];
  const format = faker.helpers.arrayElement(formats);
  return faker.string.numeric({ allowLeadingZeros: false, length: 10 }).replace(/(\d{3})(\d{3})(\d{4})/, 
    (_, p1, p2, p3) => {
      if (format.includes('x')) {
        const ext = faker.string.numeric({ length: 3 });
        return `${p1}.${p2}.${p3} x${ext}`;
      } else if (format.startsWith('#-')) {
        return `1-${p1}-${p2}-${p3}`;
      } else {
        return `${p1}-${p2}-${p3}`;
      }
    });
};

const createRandomPatient = () => {
  const statusOptions: PatientStatus[] = ['Active', 'Discharged', 'Pending'];
  const genderOptions: Gender[] = ['Male', 'Female', 'Other'];
  const bloodTypeOptions: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const gender = faker.helpers.arrayElement(genderOptions);

  return {
    id: faker.string.alphanumeric(32), // Use alphanumeric ID similar to those in screenshot
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    dob: faker.date.birthdate({ min: 18, max: 90, mode: 'age' }),
    bloodType: faker.helpers.arrayElement(bloodTypeOptions),
    phone: createFormattedPhone(),
    email: `${firstName}.${lastName}${faker.number.int(99)}@${faker.helpers.arrayElement(['gmail.com', 'yahoo.com', 'hotmail.com'])}`,
    address: faker.location.streetAddress(true), // Includes secondary address
    diagnosis: faker.lorem.words(3),
    admissionDate: faker.date.past({ years: 2 }),
    status: faker.helpers.arrayElement(statusOptions),
  };
};

export const mockPatients: Patient[] = Array.from({ length: 1000 }, createRandomPatient)
  .map((patient, index) => ({ ...patient, rowNumber: index + 1 })); 