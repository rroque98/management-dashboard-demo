import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface SuccessSnackbarProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

const SuccessSnackbar: React.FC<SuccessSnackbarProps> = ({
  open,
  message,
  severity,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={1000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: '100%' }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SuccessSnackbar;
