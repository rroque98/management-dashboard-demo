import React, { useMemo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Button,
  CircularProgress,
  Grid2,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Address } from '../types';
import usePatients from '../hooks/usePatients';
import useCustomFields from '../hooks/useCustomFields';

const PatientTable: React.FC = () => {
  const {
    patients,
    loading: loadingPatients,
    error: patientsError,
  } = usePatients();

  const {
    customFields = [],
    loading: loadingCustomFields,
    error: customFieldsError,
  } = useCustomFields();

  const handleDelete = (id: number) => {
    // TODO: Implement delete. Should deleting action even be a part of the main dashboard view?
    console.log('deleting patient with id: ', id);
  };

  const standardColumns: GridColDef[] = [
    { field: 'firstName', headerName: 'First', flex: 1 },
    { field: 'middleName', headerName: 'Middle', flex: 1 },
    { field: 'lastName', headerName: 'Last', flex: 1 },
    { field: 'dob', headerName: 'DOB', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'addresses',
      headerName: 'Address',
      flex: 2,
      valueGetter: (params: Address[]) => {
        const address = params[0];
        const addressLine = address.addressLine2
          ? `${address.addressLine1} ${address.addressLine2}`
          : address.addressLine1;
        return address
          ? `${addressLine}, ${address.city}, ${address.state} ${address.zip}`
          : 'N/A';
      },
    },
  ];

  // Generate custom columns based on custom fields
  const customColumns: GridColDef[] = useMemo(() => {
    return customFields.map((field) => {
      let renderCell: GridColDef['renderCell'] | undefined = undefined;

      switch (field.fieldType) {
        case 'boolean':
          renderCell = (params) => {
            const value = params?.row?.customFieldValues?.[field.id];
            return value !== null && value !== undefined
              ? value
                ? 'Yes'
                : 'No'
              : 'N/A';
          };
          break;
        case 'date':
          renderCell = (params) => {
            const value = params.row.customFieldValues
              ? params.row.customFieldValues[field.id]
              : null;
            return value ? new Date(value).toLocaleDateString() : 'N/A';
          };
          break;
        default:
          renderCell = (params) => {
            const value = params.row.customFieldValues
              ? params.row.customFieldValues[field.id]
              : null;
            return value !== null && value !== undefined
              ? value.toString()
              : 'N/A';
          };
      }

      return {
        field: field.id,
        headerName: field.label,
        flex: 1,
        type: 'string',
        renderCell: renderCell,
      };
    });
  }, [customFields]);

  const actionColumns: GridColDef[] = [
    {
      field: 'details',
      headerName: 'Details',
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          component={Link}
          to={`/details/${params.row.id}`}
        >
          View Details
        </Button>
      ),
      flex: 2,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: (params) => (
        <Grid2 direction="row">
          <Button
            variant="contained"
            size="small"
            component={Link}
            to={`/edit/${params.row.id}`}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Grid2>
      ),
      flex: 3,
    },
  ];

  const columns: GridColDef[] = [
    ...standardColumns,
    ...customColumns,
    ...actionColumns,
  ];

  if (loadingPatients || loadingCustomFields) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (patientsError || customFieldsError) {
    return (
      <Typography color="error" align="center" sx={{ marginTop: 4 }}>
        {patientsError || customFieldsError}
      </Typography>
    );
  }

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid rows={patients} columns={columns} />
    </div>
  );
};

export default PatientTable;
