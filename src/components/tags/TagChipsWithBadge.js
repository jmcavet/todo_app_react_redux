import React, { useState, useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { firestoreConnect } from 'react-redux-firebase'

import { Box } from '@mui/material'

import LoadingLinearProgress from '../layout/LoadingLinearProgress'
import TagChipWithBadge from './TagChipWithBadge'
import { selectTagAction } from '../../store/actions/tagActions'

const TagChipsWithBadge = ({
    auth, tags, categorySelected, tagSelected,
    selectTagAction
}) => {

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

    if (!authId) return <Navigate to="/signin" />

    if (!myTags) return <LoadingLinearProgress />

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
                    return (
                        <TagChipWithBadge
                            tag={tag}
                            categorySelected={categorySelected}
                            key={tag.id}
                        />
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
    }
}


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'tags', orderBy: ['createdAt', 'desc'] }
    ])
)(TagChipsWithBadge)