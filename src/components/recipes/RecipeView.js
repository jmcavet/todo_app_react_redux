import React from 'react'
import { Navigate, useParams } from "react-router-dom"
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'

import { Grid, Typography, Chip } from "@mui/material"

import LoadingLinearProgress from '../layout/LoadingLinearProgress'
import { deleteRecipeAction } from '../../store/actions/recipeActions'

const style = {
    container: {
        marginTop: '1rem',
        backgroundColor: 'white'
    }
}

const RecipeView = ({
    auth, recipes, recipeTags
}) => {
    const authId = auth.uid

    const params = useParams()
    const recipeId = params.id

    const delimiter = < div style={{
        width: '100%', height: '1px', background: 'rgb(240, 240, 240)',
        marginBottom: '.7rem'
    }}></div >

    const displayElements = (elements, type = null) => {
        return (
            elements.map((element, index) => {
                const text = type === "steps" ? (index + 1) + ". " + element : element
                return (
                    <Typography variant="h6" component="div" sx={{ mb: 1 }} key={index}>
                        {text}
                    </Typography>
                )
            })
        )
    }

    if (!authId) return <Navigate to="/signin" />

    const myRecipe = recipes ? recipes.filter(recipe => recipe.id === recipeId)[0] : null

    if (!myRecipe || !recipeTags) return <LoadingLinearProgress />

    const tagsForThisRecipe = recipeTags?.filter(recipeTag => {
        return myRecipe.tags.includes(recipeTag.id)
    }).map(tag => tag.name)

    const tagChips = tagsForThisRecipe?.map(tagName => {
        return (
            <Chip
                label={tagName}
                style={{
                    marginRight: ".5rem",
                    marginBottom: ".2rem",
                    background: "rgb(0, 32, 63)",
                    color: "rgb(173, 239, 209)"
                }}
                key={tagName}
            />
        )
    })

    return (
        <div className="row">
            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }} style={style.container}>
                <Grid item xs={12} sm={12} md={12}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Title
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ mb: 2 }}>
                        {myRecipe.title}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>
                        Ingredients
                    </Typography>
                    {delimiter}
                    {displayElements(myRecipe.ingredients)}
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>
                        Tags
                    </Typography>
                    {delimiter}
                    {tagChips}
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Steps
                    </Typography>
                    {delimiter}
                    {displayElements(myRecipe.steps, "steps")}
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Source
                    </Typography>
                    {delimiter}
                    <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                        <a href={`${myRecipe.source}`} target="_blank" rel="noreferrer">
                            {myRecipe.source}
                        </a>
                    </Typography>
                </Grid>
            </Grid>
        </div >
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        recipes: state.firestore.ordered.recipes,
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
        { collection: 'recipes', orderBy: ['createdAt', 'desc'] },
        { collection: 'recipeTags', orderBy: ['createdAt', 'desc'] },
    ])
)(RecipeView)