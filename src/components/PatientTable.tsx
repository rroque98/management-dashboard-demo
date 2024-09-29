import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Patient } from '../types';
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
    { field: 'address', headerName: 'Address', flex: 2 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
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
