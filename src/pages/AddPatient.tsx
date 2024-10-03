import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import AddressForm from '../components/AddressForm';
import CustomFieldsForm from '../components/CustomFieldsForm';
import { addPatient } from '../firebase/patients';
import { Patient } from '../types';
import { generateUUID } from '../utils';

const AddPatient: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<Patient>({
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      dob: '',
      status: 'Inquiry',
      addresses: [
        {
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          zip: '',
        },
      ],
      customFieldValues: {},
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: Patient) => {
    setSubmitting(true);
    try {
      // Assign unique IDs to each address if not already assigned
      const addressesWithId = data.addresses.map((addr) => ({
        ...addr,
        id: addr.id || generateUUID(),
      }));
      const patientData: Patient = {
        ...data,
        addresses: addressesWithId,
      };
      await addPatient(patientData);
      navigate('/');
    } catch (error) {
      console.error('Failed to add patient:', error);
      setError('Failed to add patient. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <Paper sx={{ padding: 4, maxWidth: 900, margin: '20px auto' }}>
      <Typography variant="h5" gutterBottom>
        Add New Patient
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              label="First Name"
              {...register('firstName', { required: 'First name is required' })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              fullWidth
            />
            <TextField
              label="Middle Name"
              {...register('middleName')}
              error={!!errors.middleName}
              helperText={errors.middleName?.message}
              fullWidth
            />
            <TextField
              label="Last Name"
              {...register('lastName', { required: 'Last name is required' })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              fullWidth
            />
            <TextField
              label="Date of Birth"
              type="date"
              {...register('dob', { required: 'Date of Birth is required' })}
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!errors.dob}
              helperText={errors.dob?.message}
              fullWidth
            />
            <TextField
              select
              label="Status"
              {...register('status', { required: 'Status is required' })}
              error={!!errors.status}
              helperText={errors.status?.message}
              fullWidth
            >
              {['Inquiry', 'Onboarding', 'Active', 'Churned'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <AddressForm />
            <CustomFieldsForm />
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? <CircularProgress size={24} /> : 'Add Patient'}
            </Button>
            {error && (
              <Typography color="error" align="center">
                {error}
              </Typography>
            )}
          </Stack>
        </form>
      </FormProvider>
    </Paper>
  );
};

export default AddPatient;
