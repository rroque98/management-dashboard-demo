import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Address, Patient } from '../types';
import { Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

interface PatientTableProps {
  patients: Patient[];
}

const PatientTable: React.FC<PatientTableProps> = ({ patients }) => {
  const handleDelete = (id: number) => {
    // TODO: Implement delete. Should deleting action even be a part of the main dashboard view?
    console.log('deleting patient with id: ', id);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
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
    {
      field: 'details',
      headerName: 'Details',
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            component={Link}
            to={`/details/${params.row.id}`}
          >
            View Details
          </Button>
        </Stack>
      ),
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            size="small"
            component={Link}
            to={`/edit/${params.row.id}`}
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
        </Stack>
      ),
      flex: 1,
    },
  ];

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid rows={patients} columns={columns} />
    </div>
  );
};

export default PatientTable;
