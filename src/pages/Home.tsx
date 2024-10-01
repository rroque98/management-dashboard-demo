import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import PatientTable from '../components/PatientTable';
import { Patient } from '../types';
import AddPatient from './AddPatient';
import EditPatient from './EditPatient';
import { testPatients } from '../testPatients';
import PatientDetails from './PatientDetails';

const Home: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(testPatients);

  const addPatient = (patient: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
      id: patients.length
        ? `${Number(patients[patients.length - 1].id) + 1}`
        : '1',
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
      <Route
        path="/details/:id"
        element={<PatientDetails patients={patients} />}
      />
    </Routes>
  );
};

export default Home;
