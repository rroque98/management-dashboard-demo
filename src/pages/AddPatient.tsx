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
import { addPatientToFirestore } from '../firebase/firestore';
import AddressForm from '../components/AddressForm';
import { Patient } from '../types';
import { customFieldsConfig } from '../testPatients';
import { generateUUID } from '../utils';

const AddPatient: React.FC = () => {
  const navigate = useNavigate();

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
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: Patient) => {
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
      await addPatientToFirestore(patientData);
      navigate('/');
    } catch (error) {
      console.error('Failed to add patient:', error);
    }
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
