import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const Spinner = ({ spinner }) => {
    const spinnerLoading = spinner.loading
    const [loading, setLoading] = useState(spinnerLoading);

    useEffect(() => {
        console.log("USE EFFECT: ", spinnerLoading)
        setLoading(spinnerLoading)
    }, [spinnerLoading])

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ height: 40 }}>
                <Fade
                    in={loading}
                    // style={{
                    //     transitionDelay: loading ? '500ms' : '0ms',
                    // }}
                    unmountOnExit
                >
                    <CircularProgress color="secondary" />
                </Fade>
            </Box>
        </Box>
    );
}

const mapStateToProps = (state) => {
    return {
        spinner: state.spinner,
    }
}

export default connect(mapStateToProps, null)(Spinner)
