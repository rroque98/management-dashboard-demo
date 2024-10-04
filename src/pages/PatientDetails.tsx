import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Stack,
  Paper,
  Box,
  CircularProgress,
} from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Patient } from '../types';
import useCustomFields from '../hooks/useCustomFields';

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {
    customFields,
    loading: loadingCustomFields,
    error: customFieldsError,
  } = useCustomFields();

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) {
        setError('No patient ID provided.');
        setLoading(false);
        return;
      }

      try {
        const patientRef = doc(db, 'patients', id);
        const patientSnap = await getDoc(patientRef);

        if (patientSnap.exists()) {
          const data = patientSnap.data() as Patient;
          setPatient({ ...data, id: patientSnap.id });
        } else {
          setError('Patient not found.');
        }
      } catch (err) {
        setError('Failed to fetch patient details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading || loadingCustomFields) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || customFieldsError) {
    return (
      <Typography color="error" align="center" sx={{ marginTop: 4 }}>
        {error}
      </Typography>
    );
  }

  if (!patient) {
    return <Typography variant="h6">Patient not found.</Typography>;
  }

  return (
    <Paper sx={{ padding: 4, maxWidth: 800, margin: '20px auto' }}>
      <Stack spacing={2}>
        <Typography variant="h5">Patient Details</Typography>
        <Typography>
          <strong>First Name:</strong> {patient.firstName}
        </Typography>
        <Typography>
          <strong>Middle Name:</strong> {patient.middleName}
        </Typography>
        <Typography>
          <strong>Last Name:</strong> {patient.lastName}
        </Typography>
        <Typography>
          <strong>Date of Birth:</strong> {patient.dob}
        </Typography>
        <Typography>
          <strong>Status:</strong> {patient.status}
        </Typography>
        <Box>
          <Typography variant="h6">Addresses</Typography>
          {patient.addresses.length === 0 ? (
            <Typography>No addresses available.</Typography>
          ) : (
            patient.addresses.map((address) => (
              <Box
                key={address.id}
                sx={{ padding: 1, borderBottom: '1px solid #ccc' }}
              >
                <Typography>{address.addressLine1}</Typography>
                {address.addressLine2 && (
                  <Typography>{address.addressLine2}</Typography>
                )}
                <Typography>
                  {`${address.city}, ${address.state} ${address.zip}`}
                </Typography>
              </Box>
            ))
          )}
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Custom Fields
          </Typography>
          {customFields && customFields.length > 0 ? (
            customFields.map((field) => {
              const value = patient?.customFieldValues?.[field.id];
              let displayValue: string | number | boolean = 'N/A';
              if (value !== undefined && value !== null) {
                switch (field.fieldType) {
                  case 'boolean':
                    displayValue = value ? 'Yes' : 'No';
                    break;
                  case 'date':
                    if (typeof value === 'string') {
                      displayValue = new Date(value).toLocaleDateString();
                    } else {
                      displayValue = value;
                    }
                    break;
                  case 'number':
                    displayValue = value;
                    break;
                  default:
                    displayValue = value.toString();
                }
              }

              return (
                <Box key={field.id} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">
                    <strong>{field.label}:</strong> {displayValue}
                  </Typography>
                </Box>
              );
            })
          ) : (
            <Typography variant="body1">No custom fields available.</Typography>
          )}
        </Box>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Stack>
    </Paper>
  );
};

export default PatientDetails;
