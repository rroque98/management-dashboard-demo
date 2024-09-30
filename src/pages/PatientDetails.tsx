import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Stack, Paper, Box } from '@mui/material';
import { Patient } from '../types';

interface PatientDetailsProps {
  patients: Patient[];
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patients }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patientId = Number(id);
  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return <Typography variant="h6">Patient not found.</Typography>;
  }

  return (
    <Paper sx={{ padding: 4, maxWidth: 800, margin: '20px auto' }}>
      <Stack spacing={2}>
        <Typography variant="h5">Patient Details</Typography>
        <Typography>
          <strong>Name:</strong> {patient.name}
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
                <Typography>
                  <strong>Address Line 1:</strong> {address.addressLine1}
                </Typography>
                {address.addressLine2 && (
                  <Typography>
                    <strong>Address Line 2:</strong> {address.addressLine2}
                  </Typography>
                )}
                <Typography>
                  <strong>City:</strong> {address.city}, <strong>State:</strong>{' '}
                  {address.state}, <strong>Zip:</strong> {address.zip},{' '}
                  <strong>Country:</strong> {address.country}
                </Typography>
              </Box>
            ))
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
