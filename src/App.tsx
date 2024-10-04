import React, { Suspense, lazy } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Header from './components/Header';
import Login from './components/Auth/Login';

const PatientTable = lazy(() => import('./pages/PatientTable'));
const Register = lazy(() => import('./components/Auth/Register'));
const AddPatient = lazy(() => import('./pages/AddPatient'));
const EditPatient = lazy(() => import('./pages/EditPatient'));
const CustomFieldsManagement = lazy(
  () => import('./pages/CustomFieldsManagement')
);
const PatientDetails = lazy(() => import('./pages/PatientDetails'));
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Suspense
            fallback={
              <Box
                sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}
              >
                <CircularProgress />
              </Box>
            }
          >
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
          </Suspense>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
