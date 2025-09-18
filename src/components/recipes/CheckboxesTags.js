import React, { useState, useEffect, useRef } from 'react'
import { Navigate } from "react-router-dom"

import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'

import { Checkbox, Chip, TextField, Autocomplete, IconButton } from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { makeStyles } from "@material-ui/core/styles"

import classNames from "classnames"

import { createRecipeTag, deleteRecipeTag, updateRecipe } from '../../store/actions/recipeActions'

import LoadingLinearProgress from '../layout/LoadingLinearProgress'
import EditRecipeTagDialog from './EditRecipeTagDialog'

// Here, I use '> path' inside this css to color only the icon itself, not the box around.
// It means, take the '.MuiChip-deleteIcon' box, and then take any child of tag <path />, 
// which is the element inside this delete icon (the svg itself?)
const useStyles = makeStyles({
  tag: {
    "& .MuiChip-deleteIcon > path": {
      background: "rgb(0, 32, 63)",
      color: "rgb(173, 239, 209)"
    },
  }
});

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

const CheckboxesTags = ({
  tags, setTags,
  auth, recipes, recipeTags, recipeTagReducer,
  createRecipeTag, deleteRecipeTag, updateRecipe
}) => {
  const authId = auth.uid

  const classes = useStyles()

  const [recipeTagError, setRecipeTagError] = useState(null)
  const [myRecipeTag, setMyRecipeTag] = useState({})
  const [openRecipeTagDialog, setOpenRecipeTagDialog] = useState(false)
  const [stateRecipes, setStateRecipes] = useState([])

  useEffect(() => {
    if (recipes.length > 1) {
      setStateRecipes(recipes)
    }
  }, [recipes])

  useEffect(() => {
    setRecipeTagError(recipeTagReducer.error)
  }, [recipeTagReducer.error])

  useEffect(() => {
    // If user modifies one tag name and if this specific tag is already displayed in the list of selected
    // tags ('value' property of the 'Autocomplete' component), then it should be accordingly updated.
    const tagsIds = tags?.map(tag => tag.id)
    const newTags = recipeTags?.filter(recipeTag => tagsIds?.includes(recipeTag.id))
    setTags(newTags)
  }, [recipeTags])

  const myTextfied = useRef(null)

  if (!authId) return <Navigate to="/signin" />

  // Get only documents belonging to the user
  const myRecipeTags = recipeTags?.filter(recipeTag => recipeTag.authorId === authId)

  if (!myRecipeTags) return <LoadingLinearProgress />

  const handleAddNewTag = (e) => {
    createRecipeTag({ name: myTextfied.current.value })
    myTextfied.current.value = ""
  }

  const handleEditTag = (e, tagKey) => {
    const currentRecipeTag = recipeTags?.filter(recipeTag => recipeTag.id === tagKey)[0]
    setMyRecipeTag(currentRecipeTag)

    setOpenRecipeTagDialog(true)

    // Without it, the tag is simultaneously checked. I want to avoid this!
    e.stopPropagation()
  }

  const handleRemoveTag = (e, tagKey) => {
    const currentRecipeTag = recipeTags?.filter(recipeTag => recipeTag.id === tagKey)[0]
    const currentRecipeTagId = currentRecipeTag.id

    deleteRecipeTag(currentRecipeTagId)

    const recipesFiltered = stateRecipes.filter(recipe => recipe.tags.includes(currentRecipeTagId))
    recipesFiltered.map(recipe => {
      recipe.tags = recipe.tags.filter(tag => tag !== tagKey)
      recipe.myId = recipe.id
      updateRecipe(recipe)
    })

    // Without it, the tag is simultaneously checked. I want to avoid this!
    e.stopPropagation()
  }

  const handleAutocompleteChange = (e, value) => {
    setTags(value)
  }

  const myErrorMessage = recipeTagError ?
    <p style={{ background: 'yellow', color: 'red' }}>{recipeTagError}</p> :
    null

  return (
    <>
      <EditRecipeTagDialog
        open={openRecipeTagDialog}
        setOpen={setOpenRecipeTagDialog}
        recipeTag={myRecipeTag}
      />
      {myErrorMessage}
      <Autocomplete
        id="checkboxes-tags"
        multiple
        autoHighlight
        options={myRecipeTags}
        value={tags}
        style={{ width: '100%' }}
        disableCloseOnSelect
        getOptionLabel={(option) => option.name}
        onChange={handleAutocompleteChange}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: '.5rem' }}
              checked={selected}
            />
            {option.name}
            <IconButton
              edge="end"
              color="primary"
              style={{ marginLeft: "auto", color: '#0c62ff' }}
              onClick={e => handleEditTag(e, option.id)}
            >
              <EditIcon fontSize='medium' />
            </IconButton>
            <IconButton
              edge="end"
              style={{ marginLeft: '.5rem', color: 'red' }}
              onClick={e => handleRemoveTag(e, option.id)}
            >
              <DeleteIcon fontSize='medium' />
            </IconButton>
          </li>
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              classes={{ root: classNames(classes.tag) }}
              style={{
                background: "rgb(0, 32, 63)",
                color: "rgb(173, 239, 209)"
              }}
              variant="outlined"
              label={`${option.name}`}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select or create Tags"
            inputRef={myTextfied}
            InputLabelProps={{
              style: { color: 'rgb(10, 10, 150)', background: 'rgb(250, 250, 245)' },
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleAddNewTag()
            }}
          />
        )}
      />
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    recipes: state.firestore.ordered.recipes,
    recipeTags: state.firestore.ordered.recipeTags,
    recipeTagReducer: state.recipeTagReducer
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createRecipeTag: (recipeTag) => dispatch(createRecipeTag(recipeTag)),
    deleteRecipeTag: (recipeTag) => dispatch(deleteRecipeTag(recipeTag)),
    updateRecipe: (recipe) => dispatch(updateRecipe(recipe)),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'recipes', orderBy: ['createdAt', 'desc'] },
    { collection: 'recipeTags', orderBy: ['createdAt', 'desc'] },
  ])
)(CheckboxesTags)