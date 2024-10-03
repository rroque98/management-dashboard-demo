import React, { useEffect, useState } from 'react';
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
import { addPatient } from '../firebase/patients';
import AddressForm from '../components/AddressForm';
import { CustomField, Patient } from '../types';
import { generateUUID } from '../utils';
import CustomFieldsForm from '../components/CustomFieldsForm';
import { getAllCustomFields } from '../firebase/customFields';

const AddPatient: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loadingCustomFields, setLoadingCustomFields] = useState<boolean>(true);

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

  useEffect(() => {
    const fetchCustomFields = async () => {
      try {
        const fields = await getAllCustomFields();
        setCustomFields(fields);
      } catch (err) {
        console.error('Error fetching custom fields:', err);
      } finally {
        setLoadingCustomFields(false);
      }
    };
    fetchCustomFields();
  }, []);

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

  if (loadingCustomFields) {
    return (
      <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
        Loading custom fields...
      </Typography>
    );
  }

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
            <CustomFieldsForm customFields={customFields} />
            {error && (
              <Typography color="error" align="center">
                {error}
              </Typography>
            )}
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? <CircularProgress size={24} /> : 'Add Patient'}
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </Paper>
  );
};

export default AddPatient;
