import React from 'react';
import {
  TextField,
  Stack,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import useCustomFields from '../hooks/customFields';

const CustomFieldsForm: React.FC = () => {
  const {
    customFields,
    loading: loadingCustomFields,
    error: customFieldError,
  } = useCustomFields();

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  if (loadingCustomFields) {
    return <CircularProgress size={24} />;
  }

  if (customFieldError) {
    return (
      <Typography color="error" align="center">
        {customFieldError}
      </Typography>
    );
  }

  if (!customFields?.length) {
    return null;
  }

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Additional Information
      </Typography>
      <Stack spacing={3}>
        {customFields.map((field) => {
          const fieldName = `customFieldValues.${field.id}`;
          const errorMessage = errors?.customFieldValues?.[field.id]?.message;

          switch (field.fieldType) {
            case 'string':
              return (
                <TextField
                  key={field.id}
                  label={field.label}
                  {...register(fieldName, {
                    required: field.required
                      ? `${field.label} is required`
                      : false,
                  })}
                  error={!!errorMessage}
                  helperText={errorMessage}
                  fullWidth
                />
              );
            case 'number':
              return (
                <TextField
                  key={field.id}
                  label={field.label}
                  type="number"
                  {...register(fieldName, {
                    required: field.required
                      ? `${field.label} is required`
                      : false,
                    valueAsNumber: true,
                  })}
                  error={!!errorMessage}
                  helperText={errorMessage}
                  fullWidth
                />
              );
            case 'date':
              return (
                <TextField
                  key={field.id}
                  label={field.label}
                  type="date"
                  {...register(fieldName, {
                    required: field.required
                      ? `${field.label} is required`
                      : false,
                  })}
                  slotProps={{ inputLabel: { shrink: true } }}
                  error={!!errorMessage}
                  helperText={errorMessage}
                  fullWidth
                />
              );
            case 'boolean':
              return (
                <FormControlLabel
                  key={field.id}
                  control={
                    <Controller
                      name={fieldName}
                      control={control}
                      render={({ field: controllerField }) => (
                        <Checkbox
                          {...controllerField}
                          checked={!!controllerField.value}
                        />
                      )}
                    />
                  }
                  label={field.label}
                />
              );
            default:
              return null;
          }
        })}
      </Stack>
    </Paper>
  );
};

export default CustomFieldsForm;
