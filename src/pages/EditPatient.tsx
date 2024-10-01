import React, { useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
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
import { generateUUID } from '../utils';

interface EditPatientProps {
  patients: Patient[];
  updatePatient: (updatedPatient: Patient) => void;
}

const EditPatient: React.FC<EditPatientProps> = ({
  patients,
  updatePatient,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const patientId = id;
  const patient = patients.find((p) => p.id === patientId);

  const methods = useForm<Patient>({
    defaultValues: {
      id: patientId,
      name: '',
      dob: '',
      status: 'Inquiry',
      addresses: [],
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (patient) {
      reset(patient);
    }
  }, [patient, reset]);

  const onSubmit = (data: Patient) => {
    const addressesWithId = data.addresses.map((addr) => ({
      ...addr,
      id: addr.id || generateUUID(),
    }));

    const updatedPatient: Patient = {
      ...data,
      addresses: addressesWithId,
    };

    updatePatient(updatedPatient);
    navigate('/');
  };

  if (!patient) {
    return (
      <Typography
        variant="h6"
        color="error"
        align="center"
        sx={{ marginTop: 4 }}
      >
        Patient not found.
      </Typography>
    );
  }

  return (
    <Paper sx={{ padding: 4, maxWidth: 900, margin: '20px auto' }}>
      <Typography variant="h5" gutterBottom>
        Edit Patient
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
            <Controller
              name="status"
              control={control}
              rules={{ required: 'Status is required' }}
              render={({ field }) => (
                <TextField
                  select
                  label="Status"
                  {...field}
                  error={!!errors.status}
                  helperText={errors.status?.message}
                  fullWidth
                >
                  {['Inquiry', 'Onboarding', 'Active', 'Churned'].map(
                    (option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    )
                  )}
                </TextField>
              )}
            />
            <AddressForm />
            <Button type="submit" variant="contained">
              Update Patient
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </Paper>
  );
};

export default EditPatient;
