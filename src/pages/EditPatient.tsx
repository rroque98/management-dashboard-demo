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
  Box,
} from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { updatePatientInFirestore } from '../firebase/firestore';
import AddressForm from '../components/AddressForm';
import { Patient } from '../types';
import { generateUUID } from '../utils';
import { customFieldsConfig } from '../testPatients';

const EditPatient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const defaultCustomFields: Record<string, string | number> = {};
  customFieldsConfig.forEach((field) => {
    defaultCustomFields[field.name] = field.type === 'number' ? 0 : '';
  });

  const methods = useForm<Patient>({
    defaultValues: {
      id: patient?.id || '',
      firstName: '',
      middleName: '',
      lastName: '',
      dob: '',
      status: 'Inquiry',
      addresses: [],
      customFields: defaultCustomFields,
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
      const patientData: Patient = {
        ...patient,
        status: patient.status || 'Inquiry',
        addresses:
          patient.addresses.length > 0
            ? patient.addresses
            : [
                {
                  id: generateUUID(),
                  addressLine1: '',
                  addressLine2: '',
                  city: '',
                  state: '',
                  zip: '',
                },
              ],
        customFields: {},
      };

      // Init customFields with existing data or default values
      const initCustomFields: Record<string, string | number> = {};
      customFieldsConfig.forEach((field) => {
        const defaultValue = field.type === 'number' ? 0 : '';
        initCustomFields[field.name] =
          patient?.customFields?.[field.name] ?? defaultValue;
      });
      patientData.customFields = initCustomFields;

      reset(patientData);
    }
  }, [patient, reset, customFieldsConfig]);

  const onSubmit = async (data: Patient) => {
    try {
      // Assign unique IDs to each address if not already assigned
      const addressesWithId = data.addresses.map((addr) => ({
        ...addr,
        id: addr.id || generateUUID(),
      }));
      const updatedPatient: Patient = {
        ...data,
        addresses: addressesWithId,
      };
      await updatePatientInFirestore(updatedPatient.id, updatedPatient);
      navigate('/');
    } catch (error) {
      console.error('Failed to update patient:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ marginTop: 4 }}>
        {error}
      </Typography>
    );
  }

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
              Update Patient
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </Paper>
  );
};

export default EditPatient;
