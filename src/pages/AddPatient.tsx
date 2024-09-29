import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../types';
import {
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
  Paper,
} from '@mui/material';

interface AddPatientProps {
  addPatient: (patient: Omit<Patient, 'id'>) => void;
}

const AddPatient: React.FC<AddPatientProps> = ({ addPatient }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<Omit<Patient, 'id'>>({
    name: '',
    dob: '',
    status: 'Inquiry',
    address: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPatient(form);
    navigate('/');
  };

  return (
    <Paper sx={{ padding: 4, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        Add New Patient
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
            Add Patient
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default AddPatient;
