import React from 'react'

import { IconButton } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'

const myStyle = {
    button: {
        background: '#11898f',
        color: 'white',
        textAlign: 'center',
        marginLeft: '1rem',
    }
}

const FilterButton = ({ setModalFilterOpen }) => {
    const handleClickOpen = () => {
        setModalFilterOpen(true)
    };

    return (
        <IconButton
            aria-label="filter"
            style={myStyle.button}
            onClick={handleClickOpen}
        >
            <FilterListIcon fontSize="medium" />
        </IconButton>
    );
}

export default FilterButton