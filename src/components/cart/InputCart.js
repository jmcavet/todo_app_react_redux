import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { Paper, InputBase, Button } from '@mui/material'

import { createFavorite } from '../../store/actions/favoriteActions'
import MySnackBar from '../layout/MySnackBar'

const InputCart = ({
    auth, favorites, tagSelected,
    createFavorite
}) => {
    const [state, setState] = useState({});
    const [text, setText] = useState('');
    const authId = auth.uid
    const [myFavorites, setMyFavorites] = useState(null)
    const [dialogMessage, setDialogMessage] = useState({ text: '', severity: '' })
    const [openWarningDialog, setOpenWarningDialog] = useState(false)

    useEffect(() => {
        if (authId && favorites) {
            const favoritesFiltered = favorites.filter(favorite => favorite.authorId === authId)

            setMyFavorites(favoritesFiltered)
        }
    }, [authId, favorites])

    const handleChange = (e) => {
        setText(e.target.value)

        setState(prevState => ({
            ...prevState,
            label: e.target.value,
            tagId: tagSelected.id,
            categoryId: tagSelected.categoryId,
        }))
    }

    const handleAddFavorite = (e) => {
        e.preventDefault()

        // Find if the tag entered by User already exists
        const duplicateFavorites = myFavorites?.filter(favorite => {
            return favorite.tagId === state.tagId && favorite.label === state.label
        })

        if (duplicateFavorites.length > 0) {
            setDialogMessage(prevState => ({
                ...prevState,
                text: `Favorite ${state.label} already exists!`,
                severity: 'error'
            }))
            setOpenWarningDialog(true)
        } else {
            createFavorite(state)

            // Clear text
            setText('')
        }
    }

    return (
        <div>
            <MySnackBar
                open={openWarningDialog}
                setOpen={setOpenWarningDialog}
                severity={dialogMessage.severity}
                message={dialogMessage.text}
            />
            <Paper
                component="form"
                sx={{ p: '2px 2px', mt: '.4rem', display: 'flex', alignItems: 'center', width: "100%" }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Add new Favorite"
                    inputProps={{ 'aria-label': 'add new favorite' }}
                    autoComplete="off"
                    value={text}
                    onChange={handleChange}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddFavorite}
                    type="submit"
                >
                    Add
                </Button>
            </Paper>
        </div>

    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        favorites: state.firestore.ordered.favorites,
        tagSelected: state.tagSelected,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createFavorite: (favorite) => dispatch(createFavorite(favorite))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputCart)

