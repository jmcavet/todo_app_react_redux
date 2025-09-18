import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'

import { useNavigate } from 'react-router-dom'

import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'

import { Grid, Paper, IconButton, Chip, useTheme, useMediaQuery } from "@mui/material"

import { deleteRecipeAction } from '../../store/actions/recipeActions'

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
    },
    iconView: { color: '#0d7c0d' },
}

const Recipe = ({
    recipe,
    auth, recipeTags,
    deleteRecipeAction
}) => {
    const theme = useTheme()
    const minWidthIsSmall = useMediaQuery(theme.breakpoints.up('sm'))
    const navigate = useNavigate()
    const authId = auth.uid

    const viewRecipe = () => navigate(`/recipes/${recipe.id}`)
    const deleteRecipe = () => deleteRecipeAction(recipe.id)

    if (!recipeTags || (recipeTags && recipeTags.length === 0)) return null

    const tagChips = minWidthIsSmall ? (
        <div style={{ marginLeft: "auto" }}>
            {recipe.tags?.map(tagId => {
                // Get only documents belonging to the user, then filter data
                const myRecipeTag = recipeTags?.filter(recipeTag => {
                    return recipeTag.authorId === authId && recipeTag.id === tagId
                })
                if (!myRecipeTag[0]) return null

                return (
                    <Chip
                        label={myRecipeTag[0].name}
                        style={myStyle.chip}
                        key={tagId}
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
                    aria-label="Edit"
                    onClick={viewRecipe}
                >
                    <VisibilityIcon fontSize="medium" style={myStyle.iconView} />
                </IconButton>
                <IconButton
                    aria-label="Delete"
                    onClick={deleteRecipe}
                >
                    <DeleteIcon fontSize="medium" style={{ color: 'red' }} />
                </IconButton>
            </Paper>
        </Grid >
    );
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        recipeTags: state.firestore.ordered.recipeTags,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        deleteRecipeAction: (recipe) => dispatch(deleteRecipeAction(recipe)),
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'recipeTags', orderBy: ['createdAt', 'desc'] },
    ])
)(Recipe)