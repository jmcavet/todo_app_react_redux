import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { Badge, Chip } from '@mui/material'

import { selectCategory } from '../../store/actions/categoryActions'
import { reverseColor, rgbCode } from '../../helper/color'

const CategoryChipWithBadge = ({
    category, categorySelected, key,
    favoriteReducer,
    selectCategory
}) => {
    const [count, setCount] = useState(0)

    const favoriteCategoriesIds = favoriteReducer?.favorites.map(favorite => favorite.categoryId)

    useEffect(() => {
        const nbCategoryFavorites = favoriteCategoriesIds?.filter(categoryId => categoryId === category.id)
        setCount(nbCategoryFavorites.length)
    }, [favoriteCategoriesIds])

    const handleChipClick = () => {
        selectCategory({
            id: category.id,
            label: category.label,
            color: category.color,
        })
    }

    const categoryColorDb = category.color
    const chipBackgroundColor = categoryColorDb ? rgbCode(categoryColorDb) : 'white'
    const chipTextColor = reverseColor(categoryColorDb)

    const chipStyle = {
        chip: {
            background: categorySelected && categorySelected.id === category.id ? chipBackgroundColor : 'white',
            color: categorySelected && categorySelected.id === category.id ? chipTextColor : 'black',
            fontSize: '1rem',
            border: `.2rem ${chipBackgroundColor} solid`,
        }
    }

    return (
        <Badge color="primary" badgeContent={count}>
            <Chip
                label={category.label}
                style={chipStyle.chip}
                onClick={handleChipClick}
                key={key}
            />
        </Badge>
    )
}

const mapStateToProps = (state) => {
    return {
        favoriteReducer: state.favorite
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectCategory: (payload) => dispatch(selectCategory(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryChipWithBadge)