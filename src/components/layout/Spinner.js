import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { Box, Fade, CircularProgress } from '@mui/material'

const Spinner = ({ spinner }) => {
    const spinnerLoading = spinner.loading
    const [loading, setLoading] = useState(spinnerLoading)

    useEffect(() => {
        setLoading(spinnerLoading)
    }, [spinnerLoading])

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ height: 40 }}>
                <Fade in={loading} unmountOnExit >
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
