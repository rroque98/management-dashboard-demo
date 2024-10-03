import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PatientTable from '../components/PatientTable';
import AddPatient from './AddPatient';
import EditPatient from './EditPatient';
import PatientDetails from './PatientDetails';

const Home: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PatientTable />} />
      <Route path="/add" element={<AddPatient />} />
      <Route path="/edit/:id" element={<EditPatient />} />
      <Route path="/details/:id" element={<PatientDetails />} />
    </Routes>
  );
};

export default Home;
