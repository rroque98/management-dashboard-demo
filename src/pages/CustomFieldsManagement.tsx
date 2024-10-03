import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import {
  addCustomField,
  getAllCustomFields,
  updateCustomField,
  deleteCustomField,
} from '../firebase/customFields';
import { CustomField } from '../types';

const CustomFieldsManagement: React.FC = () => {
  const { register, handleSubmit, control, reset } = useForm<CustomField>({
    defaultValues: {
      label: '',
      fieldType: 'string',
      required: false,
    },
  });

  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);

  useEffect(() => {
    const fetchCustomFields = async () => {
      try {
        const fields = await getAllCustomFields();
        setCustomFields(fields);
      } catch (error) {
        console.error('Error fetching custom fields:', error);
      }
    };

    fetchCustomFields();
  }, []);

  const onSubmit = async (data: CustomField) => {
    try {
      if (editingField) {
        await updateCustomField({ ...editingField, ...data });
      } else {
        await addCustomField({ ...data });
      }
      const fields = await getAllCustomFields();
      setCustomFields(fields);
      reset();
      setIsDialogOpen(false);
      setEditingField(null);
    } catch (error) {
      console.error('Error saving custom field:', error);
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
        const fields = await getAllCustomFields();
        setCustomFields(fields);
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

  return (
    <Paper sx={{ padding: 4, maxWidth: 800, margin: '20px auto' }}>
      <Stack spacing={3}>
        <Typography variant="h5">Manage Custom Fields</Typography>
        <Button variant="contained" onClick={handleAddNew}>
          Add New Custom Field
        </Button>
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
            {customFields.map((field) => (
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
            {!customFields?.length && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No custom fields defined.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
