import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import {
  addCustomField,
  updateCustomField,
  deleteCustomField,
} from '../firebase/customFields';
import { CustomField } from '../types';
import useCustomFields from '../hooks/useCustomFields';
import { useNotification } from '../contexts/NotificationContext';

const CustomFieldsManagement: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const {
    customFields,
    loading: loadingCustomFields,
    error: customFieldsError,
    refetch: refetchCustomFields,
  } = useCustomFields();

  const { register, handleSubmit, control, reset } = useForm<CustomField>({
    defaultValues: {
      label: '',
      fieldType: 'string',
      required: false,
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);

  const onSubmit = async (data: CustomField) => {
    try {
      if (editingField) {
        await updateCustomField({ ...editingField, ...data });
        showNotification('Custom field updated successfully!', 'success');
      } else {
        await addCustomField({ ...data });
        showNotification('Custom field added successfully!', 'success');
      }
      await refetchCustomFields();
      reset();
      setIsDialogOpen(false);
      setEditingField(null);
    } catch (error) {
      console.error('Error saving custom field:', error);
      showNotification('Error saving custom field.', 'error');
    }
  };

  const handleEdit = (field: CustomField) => {
    setEditingField(field);
    reset(field);
    setIsDialogOpen(true);
  };

  const handleDelete = async (fieldId: string) => {
    if (window.confirm('Are you sure you want to delete this custom field?')) {
      try {
        await deleteCustomField(fieldId);
        await refetchCustomFields();
      } catch (error) {
        console.error('Error deleting custom field:', error);
      }
    }
  };

  const handleAddNew = () => {
    reset({
      label: '',
      fieldType: 'string',
      required: false,
    });
    setEditingField(null);
    setIsDialogOpen(true);
  };

  if (loadingCustomFields) {
    return <CircularProgress size={24} />;
  }

  if (customFieldsError) {
    return (
      <Typography color="error" align="center">
        {customFieldsError}
      </Typography>
    );
  }

  return (
    <Paper sx={{ padding: 4, maxWidth: 800, margin: '20px auto' }}>
      <Stack spacing={3}>
        <Typography variant="h5">Manage Custom Fields</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Label</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Required</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customFields?.map((field) => (
              <TableRow key={field.id}>
                <TableCell>{field.label}</TableCell>
                <TableCell>
                  {field.fieldType.charAt(0).toUpperCase() +
                    field.fieldType.slice(1)}
                </TableCell>
                <TableCell>{field.required ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(field)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(field.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="contained" onClick={handleAddNew}>
          Add New Custom Field
        </Button>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </Stack>
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingField ? 'Edit Custom Field' : 'Add Custom Field'}
        </DialogTitle>
        <DialogContent>
          <form id="custom-field-form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3} sx={{ marginTop: 2 }}>
              <TextField
                label="Field Label"
                {...register('label', { required: 'Label is required' })}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel id="field-type-label">Field Type</InputLabel>
                <Controller
                  name="fieldType"
                  control={control}
                  rules={{ required: 'Field type is required' }}
                  render={({ field }) => (
                    <Select
                      labelId="field-type-label"
                      label="Field Type"
                      {...field}
                    >
                      <MenuItem value="string">Text</MenuItem>
                      <MenuItem value="number">Number</MenuItem>
                      <MenuItem value="date">Date</MenuItem>
                      <MenuItem value="boolean">Boolean</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
              <FormControlLabel
                control={<Checkbox {...register('required')} />}
                label="Required"
              />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button type="submit" form="custom-field-form" variant="contained">
            {editingField ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CustomFieldsManagement;
