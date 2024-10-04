import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PatientTable from './pages/PatientTable';
import AddPatient from './pages/AddPatient';
import EditPatient from './pages/EditPatient';
import PatientDetails from './pages/PatientDetails';
import CustomFieldsManagement from './pages/CustomFieldsManagement';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Header from './components/Header';
import Login from './components/Auth/Login';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <PatientTable />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <AddPatient />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <EditPatient />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/details/:id"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <PatientDetails />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/custom-fields"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <CustomFieldsManagement />
                  </>
                </ProtectedRoute>
              }
            />

            {/* Fallback Route for 404 - Not Found */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                      <h2>404 - Page Not Found</h2>
                      <p>The page you are looking for does not exist.</p>
                    </div>
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
