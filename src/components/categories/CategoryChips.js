import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { Box, Chip } from '@mui/material'

import { selectCategory } from '../../store/actions/categoryActions'
import { reverseColor, rgbCode } from '../../helper/color'

const CategoryChips = ({
    auth, categories, categorySelected,
    selectCategory }
) => {
    const [myCategories, setMyCategories] = useState(null)
    const authId = auth.uid

    useEffect(() => {
        if (authId && categories) {
            // Get only documents belonging to the user
            const categoriesFiltered = categories.filter(category => category.authorId === authId)
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

    const handleChipClick = (e, categoryKey) => {
        const categoryClicked = myCategories?.filter((category) => category.id === categoryKey)[0]

        selectCategory({
            id: categoryKey,
            label: categoryClicked.label,
            color: categoryClicked.color,
        })
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
                {myCategories?.map((category, index) => {
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

                    let key = category.id

                    return (
                        <Chip
                            label={category.label}
                            style={chipStyle.chip}
                            onClick={e => handleChipClick(e, key)}
                            key={key}
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoryChips)