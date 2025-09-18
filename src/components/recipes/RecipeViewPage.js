import React, { useState } from 'react'
import { useParams } from "react-router-dom"
import { Navigate, useNavigate } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'

import { Grid, Box, Toolbar, Button } from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PageviewIcon from '@mui/icons-material/Pageview'
import EditIcon from '@mui/icons-material/Edit'

import { deleteRecipeAction } from '../../store/actions/recipeActions'
import RecipeView from './RecipeView'
import RecipeForm from './RecipeForm'
import LoadingLinearProgress from '../layout/LoadingLinearProgress'

const style = {
    container: {
        marginTop: '1rem',
        backgroundColor: 'white'
    }
}

const RecipeViewPage = ({
    auth, recipes
}) => {
    const authId = auth.uid

    const navigate = useNavigate()
    const params = useParams()
    const recipeId = params.id

    const [updateIsChecked, SetUpdateIsChecked] = useState(false)

    if (!authId) return <Navigate to="/signin" />

    const myRecipe = recipes ?
        recipes?.filter(recipe => recipe.id === recipeId)[0] :
        null

    if (!myRecipe) return (
        <div className="container">
            <Toolbar />
            <div className="row">
                <div style={{ display: "flex", justifyContent: 'center' }}>
                    <LoadingLinearProgress />
                </div>
            </div>
        </div>
    )

    const handleBackToRecipes = () => navigate("/recipes")
    const handleCheckUpdate = () => SetUpdateIsChecked(!updateIsChecked)

    const viewOrUpdateForm = updateIsChecked ?
        <RecipeForm
            openRecipeForm={true}
            recipeTitle={myRecipe.title}
            recipeSteps={myRecipe.steps}
            recipeIngredients={myRecipe.ingredients}
            recipeTags={myRecipe.tags}
            recipeSource={myRecipe.source}
            recipeId={recipeId}
            btnAddOrUpdate='update'
        /> :
        <RecipeView />

    const btnUpdateView = updateIsChecked ?
        {
            icon: <PageviewIcon fontSize="medium" />,
            text: 'View'
        } :
        {
            icon: <EditIcon fontSize="medium" />,
            text: 'Update'
        }

    return (
        <div className="container">
            <Toolbar />
            <div className="row">
                <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }} style={style.container}>
                    <Grid item xs={12} sm={12} md={12}>
                        <Box sx={{ display: 'flex', mt: 2, mb: 2 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                endIcon={<ArrowBackIcon fontSize='large' />}
                                onClick={handleBackToRecipes}
                            >
                                Back to recipes
                            </Button>
                            <Button
                                variant="contained"
                                color="warning"
                                endIcon={btnUpdateView.icon}
                                onClick={handleCheckUpdate}
                                style={{ marginLeft: 'auto' }}
                            >
                                {btnUpdateView.text}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                {viewOrUpdateForm}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        recipes: state.firestore.ordered.recipes,
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
    ])
)(RecipeViewPage)
