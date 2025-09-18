import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { Box, Chip } from '@mui/material'

import { selectTagAction, setTagIdAction } from '../../store/actions/tagActions'
import { reverseColor, rgbCode } from '../../helper/color'

const TagChips = ({
    auth, tags, categorySelected, tagSelected,
    selectTagAction, setTagIdAction }
) => {
    const [myTags, setMyTags] = useState(null)

    const authId = auth.uid

    useEffect(() => {
        if (authId && tags) {
            // Get only documents belonging to the user
            const tagsFiltered = tags.filter(tag => tag.authorId === authId)
            setMyTags(tagsFiltered)

            // If no tag has been selected yet (first load) or the tag previously selected
            // does not belong to the category that has been clicked::
            // If the category has no tags yet defined, do nothing
            // Otherwise, take the first one available in the list and select it
            if (!tagSelected.id || tagSelected.categoryId !== categorySelected.id) {
                const tagsForCategorySelected = tagsFiltered.filter(tag => tag.categoryId === categorySelected.id)
                if (tagsForCategorySelected.length > 0) {
                    const firstTag = tagsForCategorySelected[0]
                    selectTagAction({
                        id: firstTag.id,
                        label: firstTag.label,
                        categoryId: firstTag.categoryId,
                    })
                }
            }
        }
    }, [authId, tags, categorySelected])

    const handleChipClick = (e, tagKey) => {
        // Set the id property of the 'tagSelected' state object
        setTagIdAction(tagKey)

        const tagClicked = myTags?.filter(tag => tag.id === tagKey)[0]

        selectTagAction({
            id: tagKey,
            label: tagClicked.label,
            categoryId: tagClicked.categoryId,
        })
    }

    const testTag = myTags?.filter(tag => tag.categoryId === categorySelected.id)
    if (testTag?.length === 0) {
        return (
            <>
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <span style={{ background: '#ffff9e', padding: '.5rem' }}>
                        First, create a tag for this category!
                    </span>
                </div>
            </>
        )
    }

    return (
        <div>
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
                columnGap: '.8rem',
                rowGap: '1.2rem'
            }}>
                {myTags?.map((tag, index) => {
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

                    let key = tag.id

                    return (
                        tag.categoryId === categorySelected.id
                            ? (<Chip
                                label={tag.label}
                                style={chipStyle.chip}
                                onClick={e => handleChipClick(e, key)}
                                key={key}
                            />)
                            : ''
                    )
                })}
            </Box>
        </div >
    );
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        tags: state.firestore.ordered.tags,
        categorySelected: state.categorySelected,
        tagSelected: state.tagSelected,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectTagAction: (payload) => dispatch(selectTagAction(payload)),
        setTagIdAction: (payload) => dispatch(setTagIdAction(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TagChips)