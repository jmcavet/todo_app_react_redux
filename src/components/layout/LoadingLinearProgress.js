import React from 'react'

import { LinearProgress } from '@mui/material'

const LoadingLinearProgress = () => {
    return (
        <div style={
            { margin: 'auto', marginTop: '4rem', textAlign: 'center' }
        }>
            <h4>Fetching data...</h4>
            <LinearProgress />
        </div>
    )
}

export default LoadingLinearProgress
