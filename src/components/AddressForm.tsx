import React from 'react';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import {
  TextField,
  IconButton,
  Typography,
  Paper,
  Grid,
  Stack,
  Button,
} from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import { generateUUID } from '../utils';
import { Patient } from '../types';

const AddressForm: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<Patient>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'addresses',
  });

  return (
    <Paper sx={{ padding: 2, marginBottom: 4 }}>
      <Typography variant="h6" gutterBottom>
        Addresses
      </Typography>
      {fields.map((field, idx) => (
        <Stack key={field.id} spacing={2} sx={{ marginBottom: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Controller
                name={`addresses.${idx}.addressLine1`}
                control={control}
                rules={{ required: 'Address Line 1 is required' }}
                render={({ field }) => (
                  <TextField
                    label="Address Line 1"
                    {...field}
                    error={!!errors.addresses?.[idx]?.addressLine1}
                    helperText={errors.addresses?.[idx]?.addressLine1?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name={`addresses.${idx}.addressLine2`}
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Address Line 2"
                    {...field}
                    error={!!errors.addresses?.[idx]?.addressLine2}
                    helperText={errors.addresses?.[idx]?.addressLine2?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name={`addresses.${idx}.city`}
                control={control}
                rules={{ required: 'City is required' }}
                render={({ field }) => (
                  <TextField
                    label="City"
                    {...field}
                    error={!!errors.addresses?.[idx]?.city}
                    helperText={errors.addresses?.[idx]?.city?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name={`addresses.${idx}.state`}
                control={control}
                rules={{ required: 'State is required' }}
                render={({ field }) => (
                  <TextField
                    label="State"
                    {...field}
                    error={!!errors.addresses?.[idx]?.state}
                    helperText={errors.addresses?.[idx]?.state?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name={`addresses.${idx}.zip`}
                control={control}
                rules={{
                  required: 'Zip Code is required',
                  pattern: {
                    value: /^\d{5}(-\d{4})?$/,
                    message: 'Invalid Zip Code',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    label="Zip Code"
                    {...field}
                    error={!!errors.addresses?.[idx]?.zip}
                    helperText={errors.addresses?.[idx]?.zip?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <IconButton
                color="error"
                onClick={() => remove(idx)}
                disabled={fields.length === 1}
                aria-label="Remove Address"
              >
                <RemoveCircle />
              </IconButton>
            </Grid>
          </Grid>
        </Stack>
      ))}
      <Button
        variant="outlined"
        startIcon={<AddCircle />}
        onClick={() =>
          append({
            id: generateUUID(),
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zip: '',
          })
        }
      >
        Add Address
      </Button>
    </Paper>
  );
};

export default AddressForm;
