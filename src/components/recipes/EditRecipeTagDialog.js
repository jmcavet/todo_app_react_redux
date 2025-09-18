import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'

import { updateRecipeTag } from '../../store/actions/recipeActions'

const EditRecipeTagDialog = ({
    open, setOpen, recipeTag,
    updateRecipeTag
}) => {
    const [state, setState] = useState(recipeTag)
    const [myRecipeTagText, setMyRecipeTagText] = useState(null)

    useEffect(() => {
        setMyRecipeTagText(recipeTag.name)
        setState(recipeTag)
    }, [recipeTag.name])

    const handleClose = () => setOpen(false)

    const handleChangeRecipeTag = (e) => {
        setMyRecipeTagText(e.target.value)

        setState(prevState => ({
            ...prevState,
            name: e.target.value
        }))
    }

    const handleUpdateMeal = (e) => {
        e.preventDefault()

        updateRecipeTag(state)

        setOpen(false)
        setMyRecipeTagText(null)
    }

    return (
        <Dialog open={open} onClose={handleClose} onKeyUp={(e) => {
            if (e.key === 'Enter') handleUpdateMeal(e)
        }}>
            <DialogTitle>Update Recipe Tag</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense" id="label-recipe-tag" label="Recipe Tag" type="text"
                    fullWidth variant="standard"
                    autoComplete='off'
                    value={myRecipeTagText}
                    onChange={handleChangeRecipeTag}
                />
            </DialogContent>
            <DialogActions>
                <Button type="button" onClick={handleClose}>Cancel</Button>
                <Button
                    variant="contained"
                    endIcon={<EditIcon fontSize='large' />}
                    onClick={handleUpdateMeal}
                >
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateRecipeTag: (recipeTag) => dispatch(updateRecipeTag(recipeTag)),
    }
}

export default connect(null, mapDispatchToProps)(EditRecipeTagDialog)