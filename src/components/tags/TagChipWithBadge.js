import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { Badge, Chip } from '@mui/material'

import { reverseColor, rgbCode } from '../../helper/color'
import { selectTagAction, setTagIdAction } from '../../store/actions/tagActions'

const TagChipWithBadge = ({
    tag, categorySelected, key,
    tagSelected, favoriteReducer,
    selectTagAction, setTagIdAction
}) => {
    const [count, setCount] = useState(0)

    const favoriteTagsIds = favoriteReducer.favorites.map(favorite => favorite.tagId)

    useEffect(() => {
        const nbTagFavorites = favoriteTagsIds.filter(tagId => tagId === tag.id)
        setCount(nbTagFavorites.length)
    }, [favoriteTagsIds])

    const handleChipClick = () => {
        // Set the id property of the 'tagSelected' state object
        setTagIdAction(tag.id)

        selectTagAction({
            id: tag.id,
            label: tag.label,
            categoryId: tag.categoryId,
        })
    }

    const categoryColorDb = categorySelected?.color ? categorySelected.color : 'black'
    const chipBackgroundColor = categoryColorDb ? rgbCode(categoryColorDb) : 'white'
    const chipTextColor = reverseColor(categoryColorDb)

    const chipStyle = {
        chip: {
            background: tagSelected && tagSelected.id === tag.id ? chipBackgroundColor : 'white',
            color: tagSelected && tagSelected.id === tag.id ? chipTextColor : 'black',
            fontSize: '1rem',
            border: `.2rem ${chipBackgroundColor} solid`,
        }
    }

    return (
        tag.categoryId === categorySelected.id
            ? (<Badge color="primary" badgeContent={count}>
                <Chip
                    label={tag.label}
                    style={chipStyle.chip}
                    onClick={e => handleChipClick()}
                    key={key}
                />
            </Badge>)
            : ''
    )
}

const mapStateToProps = (state) => {
    return {
        tagSelected: state.tagSelected,
        favoriteReducer: state.favorite
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectTagAction: (payload) => dispatch(selectTagAction(payload)),
        setTagIdAction: (payload) => dispatch(setTagIdAction(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TagChipWithBadge)