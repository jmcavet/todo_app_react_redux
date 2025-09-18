import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { Chip } from '@mui/material'

import { filterCategories } from '../../store/actions/filterActions'
import { reverseColor, rgbCode } from '../../helper/color';

const CategoryChipFilter = ({
    category, isSelected = true,
    stateFilter,
    filterCategories
}) => {
    const [categorySelected, setCategorySelected] = useState(isSelected)

    useEffect(() => {
        setCategorySelected(isSelected)
    }, [isSelected])

    const handleChipClick = (categoryKey) => {
        const categoryIsSelected = !categorySelected
        filterCategories({
            ...stateFilter.categories,
            [categoryKey]: categoryIsSelected
        })
        setCategorySelected(!categorySelected)
    }

    const categoryColorDb = category.color
    const chipBackgroundColor = categoryColorDb ? rgbCode(categoryColorDb) : 'white'
    const chipTextColor = reverseColor(categoryColorDb)

    const chipStyle = {
        chip: {
            background: categorySelected ? chipBackgroundColor : 'white',
            color: categorySelected ? chipTextColor : 'black',
            fontSize: '1rem',
            border: `.2rem ${chipBackgroundColor} solid`,
        }
    }

    let key = category.id

    return (
        <Chip
            label={category.label}
            style={chipStyle.chip}
            onClick={e => handleChipClick(key)}
            key={key}
        />
    );
}


const mapStateToProps = (state) => {
    return {
        stateFilter: state.filter,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        filterCategories: (payload) => dispatch(filterCategories(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryChipFilter)
