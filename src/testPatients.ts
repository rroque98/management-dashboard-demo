import { Patient } from './types';

export const testPatients: Patient[] = [
  {
    id: '1',
    name: 'Tester 1',
    dob: '1985-06-15',
    status: 'Active',
    addresses: [
      {
        id: '101',
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'Springfield',
        state: 'IL',
        zip: '62704',
      },
      {
        id: '102',
        addressLine1: '456 Elm St',
        city: 'Shelbyville',
        state: 'IL',
        zip: '62565',
      },
    ],
  },
  {
    id: '2',
    name: 'Tester 2',
    dob: '1990-09-23',
    status: 'Onboarding',
    addresses: [
      {
        id: '103',
        addressLine1: '789 Oak Ave',
        addressLine2: 'Suite 12',
        city: 'Capital City',
        state: 'IL',
        zip: '62701',
      },
    ],
  },
  {
    id: '3',
    name: 'Tester 3',
    dob: '1975-12-05',
    status: 'Churned',
    addresses: [
      {
        id: '104',
        addressLine1: '321 Pine Rd',
        city: 'Ogdenville',
        state: 'IL',
        zip: '62629',
      },
      {
        id: '105',
        addressLine1: '654 Maple St',
        addressLine2: 'Floor 3',
        city: 'North Haverbrook',
        state: 'IL',
        zip: '62707',
      },
      {
        id: '106',
        addressLine1: '987 Cedar Blvd',
        city: 'Springfield',
        state: 'IL',
        zip: '62704',
      },
    ],
  },
  {
    id: '4',
    name: 'Tester 4',
    dob: '1982-03-14',
    status: 'Inquiry',
    addresses: [
      {
        id: '107',
        addressLine1: '159 Birch Ln',
        city: 'Shelbyville',
        state: 'IL',
        zip: '62565',
      },
    ],
  },
  {
    id: '5',
    name: 'Tester 5',
    dob: '1995-07-30',
    status: 'Active',
    addresses: [
      {
        id: '108',
        addressLine1: '753 Walnut St',
        addressLine2: 'Unit 5',
        city: 'Capital City',
        state: 'IL',
        zip: '62701',
      },
      {
        id: '109',
        addressLine1: '852 Cherry Ave',
        city: 'Ogdenville',
        state: 'IL',
        zip: '62629',
      },
    ],
  },
];
