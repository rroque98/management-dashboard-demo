import React, { useState } from 'react';
import PatientTable from '../components/PatientTable';
import { Patient } from '../types';

const Home: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 1,
      name: 'Active Tester',
      dob: '1985-06-15',
      status: 'Active',
      address: '123 Main St, Springfield',
    },
    {
      id: 2,
      name: 'Onboarding Tester',
      dob: '1990-01-01',
      status: 'Onboarding',
      address: '456 Elm St, Shelbyville',
    },
  ]);

  return <PatientTable patients={patients} />;
};

export default Home;
