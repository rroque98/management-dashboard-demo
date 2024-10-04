import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import PatientTable from './pages/PatientTable';
import AddPatient from './pages/AddPatient';
import EditPatient from './pages/EditPatient';
import PatientDetails from './pages/PatientDetails';
import CustomFieldsManagement from './pages/CustomFieldsManagement';
import './App.css';
import { NotificationProvider } from './contexts/NotificationContext';

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<PatientTable />} />
            <Route path="/add" element={<AddPatient />} />
            <Route path="/edit/:id" element={<EditPatient />} />
            <Route path="/details/:id" element={<PatientDetails />} />
            <Route path="/custom-fields" element={<CustomFieldsManagement />} />
          </Routes>
        </Layout>
      </Router>
    </NotificationProvider>
  );
};

export default App;
