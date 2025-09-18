import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import IconButton from '@mui/material/IconButton'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'

import Recipe from './Recipe'

import { areEqual } from '../../helper/utils'

const style = {
    iconBtnContainer: {
        display: 'flex',
        justifyContent: 'center'
    }
}
const Recipes = ({
    recipesSearch,
    auth, recipes, recipeTagReducer
}) => {
    const authId = auth.uid

    const [recipesFiltered, setRecipesFiltered] = useState([])

    const getRecipesFiltered = () => {
        // Convert the object 'recipeTagReducer.filtered' to a key/value array
        const recipeTagsObjectAsArray = Object.entries(recipeTagReducer.filtered)

        // Filter to get only those 'active'
        const recipeTagIdsActiveTest = recipeTagsObjectAsArray.filter(([_, value]) => value === 'active')
        const recipeTagIdsActive = Object.keys(Object.fromEntries(recipeTagIdsActiveTest))

        // Get only documents belonging to the user
        const myRecipes = recipes?.filter(recipe => recipe.authorId === authId)

        // Get the array of recipes having those active tags
        const myRecipesFiltered = myRecipes?.filter(recipe => {
            const recipeTags = recipe.tags
            const intersection = recipeTags.filter(x => recipeTagIdsActive.includes(x))
            const arraysAreEqual = areEqual(intersection, recipeTagIdsActive)
            return arraysAreEqual
        })
        return myRecipesFiltered
    }

    useEffect(() => {
        if (recipeTagReducer.filtered) {
            const myRecipesFiltered = getRecipesFiltered()
            setRecipesFiltered(myRecipesFiltered)
        }
    }, [recipes, recipeTagReducer.filtered])

    // Whenever the user searches for a recipe in the search bar
    useEffect(() => {
        if (recipesSearch && recipesSearch.length > 0) setRecipesFiltered(recipesSearch)
        else setRecipesFiltered(null)
    }, [recipesSearch])

    const recipesFilteredUi = recipesFiltered && recipesFiltered.length > 0 ?
        recipesFiltered.map(recipe => {
            return (<Recipe recipe={recipe} key={recipe.id} />)
        }) :
        (
            <div style={style.iconBtnContainer}>
                <IconButton sx={{ p: '10px', color: 'orangered' }} aria-label="smiley-dissatisfied">
                    <SentimentVeryDissatisfiedIcon />
                </IconButton>
                <h6>No recipes found...</h6>
            </div>
        )

    return (
        <div className="project-list section">
            {recipesFilteredUi}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        recipes: state.firestore.ordered.recipes,
        recipeTagReducer: state.recipeTagReducer,
    }
}

export default connect(mapStateToProps, null)(Recipes)