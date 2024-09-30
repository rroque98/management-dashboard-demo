import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
  Paper,
} from '@mui/material';
import { Patient } from '../types';

interface EditPatientProps {
  patients: Patient[];
  updatePatient: (patient: Patient) => void;
}

const EditPatient: React.FC<EditPatientProps> = ({
  patients,
  updatePatient,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const patientId = Number(id);
  const patient = patients.find((p) => p.id === patientId);

  const [form, setForm] = useState<Omit<Patient, 'id'>>({
    name: '',
    dob: '',
    status: 'Inquiry',
    address: '',
  });

  useEffect(() => {
    if (patient) {
      const { name, dob, status, address } = patient;
      setForm({ name, dob, status, address });
    }
  }, [patient]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patient) {
      updatePatient({ id: patient.id, ...form });
      navigate('/');
    }
  };

  if (!patient) {
    return <Typography variant="h6">Patient not found.</Typography>;
  }

  return (
    <Paper sx={{ padding: 4, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        Edit Patient
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            slotProps={{ inputLabel: { shrink: true } }}
            required
          />
          <TextField
            select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            {['Inquiry', 'Onboarding', 'Active', 'Churned'].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained">
            Update Patient
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default EditPatient;
