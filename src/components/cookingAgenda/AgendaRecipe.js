import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery, Chip } from '@mui/material'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Grid, Paper } from "@material-ui/core"
import IconButton from "@material-ui/core/IconButton"

import { createMeal } from '../../store/actions/mealActions'
import { filterRecipeTags } from '../../store/actions/recipeActions'

const myStyle = {
    paper: {
        background: 'rgb(255, 255, 255)',
        color: 'rgb(30, 30, 30)',
        margin: "auto", paddingLeft: 8, paddingRight: 0,
        display: "flex", alignItems: "center",
        marginTop: 10,
    },
    title: {
        fontSize: "1.2rem",
        marginRight: ".5rem"
    },
    chip: {
        marginRight: ".5rem",
        marginBottom: ".2rem",
        background: "rgb(0, 32, 63)",
        color: "rgb(173, 239, 209)"
    }
}

const AgendaRecipe = ({
    recipe, mealType, mealDate, setOpen,
    auth, recipeTags, recipeTagReducer,
    createMeal, filterRecipeTags
}) => {
    const theme = useTheme()
    const minWidthIsSmall = useMediaQuery(theme.breakpoints.up('sm'))
    const authId = auth.uid
    const [myRecipeTags, setMyRecipeTags] = useState([])

    useEffect(() => {
        if (auth && recipeTags) {
            // Get only documents belonging to the user
            const myRecipeTagsFilter = recipeTags.filter(recipeTag => recipeTag.authorId === authId)
            setMyRecipeTags(myRecipeTagsFilter)
        }
    }, [authId])


    const resetDialog = () => {
        Object.keys(recipeTagReducer.filtered).map(key => {
            filterRecipeTags({
                recipeTagkey: [key],
                status: 'inactive'
            })
        })
    }

    const selectRecipe = (e) => {
        createMeal({
            label: recipe.title,
            mealType,
            mealDate,
            recipeId: recipe.id
        })

        setOpen(false)

        // Reset the Dialog UI (after User has filtered tags and/or recipe titles)
        resetDialog()
    }

    if (myRecipeTags.length === 0) return <p>Loading Recipe Tag...</p>

    const tagChips = minWidthIsSmall ? (
        <div style={{ marginLeft: "auto" }}>
            {recipe.tags?.map(tagId => {
                const recipeTag = myRecipeTags.filter(recipeTag => recipeTag.id === tagId)
                return (
                    <Chip
                        label={recipeTag[0].name}
                        style={myStyle.chip}
                        key={recipeTag[0].id}
                    />
                )
            })}
        </div>
    ) : null

    const styleEditBtn = minWidthIsSmall ? null : { marginLeft: 'auto' }

    return (
        <Grid xs={12} item>
            <Paper
                elevation={4}
                style={myStyle.paper}
            >
                <span style={myStyle.title}>{recipe.title}</span>
                {tagChips}
                <IconButton
                    style={styleEditBtn}
                    aria-label="Select"
                    onClick={selectRecipe}
                >
                    <CheckCircleOutlineIcon fontSize="medium" style={{ color: 'green' }} />
                </IconButton>
            </Paper>
        </Grid >
    );
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        recipeTags: state.firestore.ordered.recipeTags,
        recipeTagReducer: state.recipeTagReducer,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createMeal: (meal) => dispatch(createMeal(meal)),
        filterRecipeTags: (payload) => dispatch(filterRecipeTags(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AgendaRecipe)