import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import PatientTable from '../components/PatientTable';
import { Patient } from '../types';
import AddPatient from './AddPatient';
import EditPatient from './EditPatient';

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

  const addPatient = (patient: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
      id: patients.length ? patients[patients.length - 1].id + 1 : 1,
      ...patient,
    };
    setPatients([...patients, newPatient]);
    // TODO: Update this to write to db
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === updatedPatient.id ? updatedPatient : patient
      )
    );
  };

  return (
    <Routes>
      <Route path="/" element={<PatientTable patients={patients} />} />
      <Route path="/add" element={<AddPatient addPatient={addPatient} />} />
      <Route
        path="/edit/:id"
        element={
          <EditPatient patients={patients} updatePatient={updatePatient} />
        }
      />
    </Routes>
  );
};

export default Home;
