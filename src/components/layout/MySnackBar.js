import React from 'react';

import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MySnackBar = ({ open, setOpen, severity, message }) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                autoHideDuration={2500}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%', fontSize: '1.3rem' }}>
                    {message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}

export default MySnackBar;