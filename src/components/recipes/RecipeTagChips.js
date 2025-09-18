import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { filterRecipeTags } from '../../store/actions/recipeActions'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

const RecipeTagChips = ({
    auth, recipeTagsAll, recipeTagReducer,
    filterRecipeTags }
) => {
    const [recipeTags, setRecipeTags] = useState(null)

    const authId = auth.uid

    useEffect(() => {
        if (authId && recipeTagsAll) {
            // Get only documents belonging to the user
            const recipeTagsFiltered = recipeTagsAll.filter(recipeTag => recipeTag.authorId === authId)
            setRecipeTags(recipeTagsFiltered)

            // If the 'filtered' state is not yet defined, set all tag 'status' as 'inactive'
            // If it has been previously set (active or inactive) by user, then set to current status
            recipeTagsFiltered.map(tag => {
                const tagExists = recipeTagReducer.filtered[tag.id]

                filterRecipeTags({
                    recipeTagkey: [tag.id],
                    status: tagExists ? tagExists : 'inactive'
                })
            })
        }
    }, [authId, recipeTagsAll])

    const handleChipClick = (e, recipeTagKey) => {
        const tagActive = recipeTagReducer.filtered[recipeTagKey] === 'active' ? true : false

        filterRecipeTags({
            recipeTagkey: [recipeTagKey],
            status: tagActive ? 'inactive' : 'active'
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
                {recipeTags?.map((recipeTag, index) => {
                    const colorDark = "rgb(0, 32, 63)"
                    const colorLight = "rgb(230, 230, 230)"

                    const chipStyle = {
                        chip: {
                            // background: recipeTagReducer.filtered[recipeTag.id] ? colorDark : colorLight,
                            // color: recipeTagReducer.filtered[recipeTag.id] ? colorLight : colorDark,
                            background: recipeTagReducer.filtered[recipeTag.id] === 'active' ? colorDark : colorLight,
                            color: recipeTagReducer.filtered[recipeTag.id] === 'active' ? colorLight : colorDark,
                            fontSize: '1rem',
                            border: `.1rem solid`,
                        }
                    }

                    let key = recipeTag.id

                    return (
                        <Chip
                            label={recipeTag.name}
                            style={chipStyle.chip}
                            onClick={e => handleChipClick(e, key)}
                            key={key}
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
        recipeTagsAll: state.firestore.ordered.recipeTags,
        recipeTagReducer: state.recipeTagReducer,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        filterRecipeTags: (payload) => dispatch(filterRecipeTags(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecipeTagChips)