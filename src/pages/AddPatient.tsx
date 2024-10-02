import React from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
  Paper,
} from '@mui/material';
import AddressForm from '../components/AddressForm';
import { Patient } from '../types';
import { customFieldsConfig } from '../testPatients';
import { generateUUID } from '../utils';

interface AddPatientProps {
  addPatient: (patient: Patient) => void;
}

const AddPatient: React.FC<AddPatientProps> = ({ addPatient }) => {
  const navigate = useNavigate();

  const methods = useForm<Patient>({
    defaultValues: {
      id: generateUUID(),
      name: '',
      dob: '',
      status: 'Inquiry',
      addresses: [
        {
          id: generateUUID(),
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          zip: '',
        },
      ],
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data: Patient) => {
    const addressesWithId = data.addresses.map((addr) => ({
      ...addr,
      id: addr.id || generateUUID(),
    }));

    const patientData: Patient = {
      ...data,
      addresses: addressesWithId,
    };

    addPatient(patientData);
    navigate('/');
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
              label="Name"
              {...register('name', { required: 'Name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
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
            {customFieldsConfig.map((fieldConfig) => (
              <Controller
                key={fieldConfig.name}
                name={`customFields.${fieldConfig.name}`}
                control={control}
                rules={
                  fieldConfig.required
                    ? { required: `${fieldConfig.label} is required` }
                    : {}
                }
                render={({ field }) => (
                  <TextField
                    label={fieldConfig.label}
                    type={fieldConfig.type}
                    {...field}
                    error={!!errors?.customFields?.[fieldConfig.name]}
                    helperText={
                      errors?.customFields?.[fieldConfig.name]?.message
                    }
                    fullWidth
                  />
                )}
              />
            ))}

            <Button type="submit" variant="contained">
              Add Patient
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </Paper>
  );
};

export default AddPatient;
