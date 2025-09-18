import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { Grid, Paper, Checkbox, IconButton } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'

import { checkFavorite, uncheckFavorite, deleteFavoriteAction } from '../../store/actions/favoriteActions'
import { reverseColor, rgbCode } from '../../helper/color'

const Cart = ({
    favorite,
    auth, todos, tags, categories, favoriteReducer,
    deleteFavoriteAction, actionCheckFavorite, actionUncheckFavorite
}) => {
    const [itemIsAlreadyInList, setItemIsAlreadyInList] = useState(false)
    const [myCategory, setMyCategory] = useState({ color: (255, 0, 0) })

    const fontDark = 'rgb(5, 5, 5)'
    const bgDisabled = 'rgb(248, 248, 248)'
    const fontDisabled = 'rgb(150, 150, 150)'

    const authId = auth.uid

    useEffect(() => {
        if (authId && todos) {
            const todosLabelsEqualFavorites = todos?.filter(todo => {
                return todo.authorId === authId && todo.label === favorite.label
            })

            if (todosLabelsEqualFavorites.length > 0) setItemIsAlreadyInList(true)
            else setItemIsAlreadyInList(false)
        }
    }, [authId, todos, favorite.label])

    useEffect(() => {
        if (authId && tags && categories) {
            const tagFiltered = tags?.filter(tag => {
                return tag.authorId === authId && tag.id === favorite.tagId
            })[0]

            if (tagFiltered) {
                const categoryFiltered = categories?.filter(category => {
                    return category.authorId === authId && category.id === tagFiltered.categoryId
                })[0]

                setMyCategory(categoryFiltered)
            }
        }
    }, [authId, tags, categories, favorite.tagId])

    const deleteFavorite = () => deleteFavoriteAction(favorite.id)
    const handleCheck = (e) => {
        const favoriteIds = favoriteReducer.favorites.map(favorite => favorite.id)

        if (favoriteIds.includes(favorite.id)) actionUncheckFavorite(favorite)
        else actionCheckFavorite(favorite)
    }

    const favoriteItem = favoriteReducer.favorites?.filter(favoriteState => favoriteState.id === favorite.id)[0]
    const bgColor = favoriteItem ? rgbCode(myCategory.color) : reverseColor(myCategory.color)
    const fontColor = favoriteItem ? reverseColor(myCategory.color) : fontDark
    const isChecked = favoriteItem ? true : false

    const myStyle = {
        paper: {
            background: itemIsAlreadyInList ? bgDisabled : bgColor,
            color: itemIsAlreadyInList ? fontDisabled : fontColor,
            margin: "auto", paddingLeft: 10, paddingRight: 10,
            display: "flex", alignItems: "center",
            marginTop: 10,
        },
        iconEdit: { color: itemIsAlreadyInList ? fontDisabled : fontColor, marginLeft: "auto", },
        iconDelete: { color: itemIsAlreadyInList ? fontDisabled : 'red', marginLeft: 'auto' },
        labelSpan: { fontSize: "1.4rem", marginLeft: '1rem' }
    }

    return (
        <Grid xs={12} item>
            <Paper elevation={3} style={myStyle.paper}>
                <Checkbox checked={isChecked} onClick={handleCheck} disabled={itemIsAlreadyInList} />
                <span style={myStyle.labelSpan} >{favorite.label}</span>
                <IconButton style={myStyle.iconDelete} aria-label="Delete" onClick={deleteFavorite}>
                    <DeleteIcon fontSize="medium" />
                </IconButton>
            </Paper>
        </Grid >
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        todos: state.firestore.ordered.todos,
        tags: state.firestore.ordered.tags,
        categories: state.firestore.ordered.categories,
        favoriteReducer: state.favorite
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actionCheckFavorite: (favorite) => dispatch(checkFavorite(favorite)),
        actionUncheckFavorite: (favorite) => dispatch(uncheckFavorite(favorite)),
        deleteFavoriteAction: (favoriteId) => dispatch(deleteFavoriteAction(favoriteId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart)