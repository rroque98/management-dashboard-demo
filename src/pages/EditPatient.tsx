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
import { customFieldsConfig } from '../testPatients';

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

  const defaultCustomFields: Record<string, string | number> = {};
  customFieldsConfig.forEach((field) => {
    defaultCustomFields[field.name] = field.type === 'number' ? 0 : '';
  });

  const methods = useForm<Patient>({
    defaultValues: {
      id: patientId,
      name: '',
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
