import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { updatePatient, getPatientById } from '../firebase/patients';
import AddressForm from '../components/AddressForm';
import { Patient } from '../types';
import { generateUUID } from '../utils';
import CustomFieldsForm from '../components/CustomFieldsForm';
import { useNotification } from '../contexts/NotificationContext';

const EditPatient: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const methods = useForm<Patient>({
    defaultValues: {
      id: '',
      firstName: '',
      middleName: '',
      lastName: '',
      dob: '',
      status: 'Inquiry',
      addresses: [],
      customFieldValues: {},
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
    const fetchData = async () => {
      if (!id) {
        setError('No patient ID provided.');
        setLoading(false);
        return;
      }

      try {
        const patientData = await getPatientById(id);
        reset(patientData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch patient details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: Patient) => {
    setSubmitting(true);
    try {
      // Ensure all addresses have unique IDs
      const processedAddresses = data.addresses.map((address) => ({
        ...address,
        id: address.id || generateUUID(),
      }));

      const updatedPatientData = {
        ...data,
        addresses: processedAddresses,
      };

      await updatePatient(updatedPatientData);
      showNotification('Patient updated successfully!', 'success');
      navigate('/');
    } catch (error) {
      console.error('Failed to update patient:', error);
      setError('Failed to update patient. Please try again.');
      showNotification('Failed to update patient.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
        Loading...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography
        variant="h6"
        color="error"
        align="center"
        sx={{ marginTop: 4 }}
      >
        {error}
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
            <CustomFieldsForm />
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? <CircularProgress size={24} /> : 'Update Patient'}
            </Button>
            <Button onClick={() => navigate(-1)}>Back</Button>
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

export default EditPatient;
