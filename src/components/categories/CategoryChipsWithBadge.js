import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'

import { Box } from '@mui/material'

import LoadingLinearProgress from '../layout/LoadingLinearProgress'
import CategoryChipWithBadge from './CategoryChipWithBadge'
import { selectCategory } from '../../store/actions/categoryActions'

const CategoryChipsWithBadge = ({
    auth, categories, categorySelected,
    selectCategory
}) => {
    const [myCategories, setMyCategories] = useState(null)

    const authId = auth.uid

    useEffect(() => {
        if (authId && categories) {
            // Get only documents belonging to the user
            const categoriesFiltered = categories?.filter(category => category.authorId === authId)
            setMyCategories(categoriesFiltered)

            // If the user has not yet selected a category, automatically select the first one available
            if (!categorySelected.id) {
                const firstCategory = categoriesFiltered[0]
                selectCategory({
                    id: firstCategory.id,
                    label: firstCategory.label,
                    color: firstCategory.color,
                })
            }
        }
    }, [authId, categories])

    if (!authId) return <Navigate to="/signin" />

    if (!myCategories) return <LoadingLinearProgress />

    return (
        <div>
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
                columnGap: '.8rem',
                rowGap: '1.2rem'
            }}>
                {myCategories?.map((category, index) => {
                    return (
                        <CategoryChipWithBadge
                            category={category}
                            categorySelected={categorySelected}
                            key={category.id}
                        />
                    )
                })}
            </Box>
        </div >
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        categories: state.firestore.ordered.categories,
        categorySelected: state.categorySelected,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectCategory: (payload) => dispatch(selectCategory(payload)),
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'categories', orderBy: ['createdAt', 'desc'] }
    ])
)(CategoryChipsWithBadge)
