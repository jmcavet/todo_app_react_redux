import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { Box, Dialog, DialogTitle, DialogContent, InputBase, IconButton } from '@mui/material'
import { Grid } from "@material-ui/core"
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import RecipeTagChips from '../recipes/RecipeTagChips'
import AgendaRecipes from './AgendaRecipes'
import { areEqual } from '../../helper/utils'

const RecipesDialog = (
    {
        open, setOpen, mealDate, mealType,
        auth, recipes, recipeTagReducer,
    }
) => {
    const [searchRecipe, setSearchRecipe] = useState('')
    const [recipesSearch, setRecipesSearch] = useState([])
    const authId = auth.uid

    const handleClose = () => setOpen(false)

    const getMyRecipesFiltered = () => {
        const recipeTagsObjectAsArray = Object.entries(recipeTagReducer.filtered)

        // Filter to get only those 'active'
        const recipeTagIdsActiveTest = recipeTagsObjectAsArray.filter(([_, value]) => value === 'active')
        const recipeTagIdsActive = Object.keys(Object.fromEntries(recipeTagIdsActiveTest))

        // Get only documents belonging to the user
        const myRecipes = recipes.filter(recipe => recipe.authorId === authId)

        // Get the array of recipes having those active tags
        const myRecipesFiltered = myRecipes?.filter(recipe => {
            const recipeTags = recipe.tags
            const intersection = recipeTags.filter(x => recipeTagIdsActive.includes(x))
            const arraysAreEqual = areEqual(intersection, recipeTagIdsActive)
            return arraysAreEqual
        })
        return myRecipesFiltered
    }

    const handleChangeSearch = (e) => {
        const search = e.target.value
        setSearchRecipe(search)

        const myRecipesFiltered = getMyRecipesFiltered()

        if (search.length > 2) {
            const myRecipesFilteredBySearch = myRecipesFiltered.filter(obj => {
                return obj.title.toLowerCase().includes(search.toLowerCase())
            })
            setRecipesSearch(myRecipesFilteredBySearch)
        }
        else {
            setRecipesSearch(myRecipesFiltered)
        }
    }

    const removeSearch = () => {
        setSearchRecipe('')

        const myRecipesFiltered = getMyRecipesFiltered()

        setRecipesSearch(myRecipesFiltered)
    }

    if (!authId) return <Navigate to="/signin" />

    return (
        <Dialog open={open} onClose={handleClose} fullWidth >
            <DialogTitle>Select a recipe</DialogTitle>
            <DialogContent>
                <div className='row'>
                    <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                        <Grid item xs={1} sm={1} md={1}>
                            <IconButton sx={{ p: '10px' }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs={10} sm={10} md={10}>
                            <InputBase
                                placeholder="Search recipe..."
                                inputProps={{ 'aria-label': 'search recipe' }}
                                value={searchRecipe}
                                autoComplete="off"
                                fullWidth
                                onChange={handleChangeSearch}
                            />
                        </Grid>
                        <Grid item xs={1} sm={1} md={1}>
                            <IconButton
                                type="button"
                                sx={{ p: '10px' }}
                                aria-label="search"
                                onClick={removeSearch}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </div>
                <Box ><RecipeTagChips /></Box>
                <AgendaRecipes
                    mealType={mealType}
                    mealDate={mealDate}
                    recipesSearch={recipesSearch}
                    setOpen={setOpen}
                />
            </DialogContent>
        </Dialog>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        recipes: state.firestore.ordered.recipes,
        recipeTagReducer: state.recipeTagReducer,
    }
}

export default connect(mapStateToProps, null)(RecipesDialog)