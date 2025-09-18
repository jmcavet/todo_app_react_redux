import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { useSpring, animated } from 'react-spring'

import { Box, Toolbar, Button, Typography } from "@mui/material"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

import CategoriesTags from './CategoriesTags'
import InputCart from './InputCart'
import Cart from './Cart'
import { definePageTitle } from '../../store/actions/settingsActions'
import { createTodo } from '../../store/actions/todoActions'
import { uncheckFavorite } from '../../store/actions/favoriteActions'

const CartPage = ({
    auth, categories, favorites, categorySelected, tagSelected, favoriteReducer,
    definePageTitle, createTodo, actionUncheckFavorite
}) => {
    const [myCategories, setMyCategories] = useState(null)
    const [myFavorites, setMyFavorites] = useState(null)
    const [isCartEmpty, setIsCartEmpty] = useState(true)
    const navigate = useNavigate()
    const authId = auth.uid

    const animationStyles = useSpring({
        from: { opacity: "0.4", color: 'blue' },
        to: [
            { opacity: "1", color: 'blue', background: 'yellow' },
            { opacity: "0.4", color: 'blue' }
        ],
        config: { duration: "500" },
        loop: true,
    })

    useEffect(() => {
        if (authId && favorites) {
            // Get only documents belonging to the user
            const favoritesFiltered = favorites?.filter(favorite => favorite.authorId === authId)
            setMyFavorites(favoritesFiltered)
        }
    }, [authId, favorites])

    useEffect(() => {
        if (authId && categories) {
            // Get only documents belonging to the user
            const categoriesFiltered = categories?.filter(category => category.authorId === authId)
            setMyCategories(categoriesFiltered)
        }
    }, [authId, categories])

    useEffect(() => {
        definePageTitle({
            pageTitle: "Cart",
        })

        if (favoriteReducer.favorites.length > 0) setIsCartEmpty(false)
        else setIsCartEmpty(true)
    }, [favoriteReducer.favorites])


    const uncheckFavorites = () => {
        favoriteReducer.favorites.map((favorite) => {
            actionUncheckFavorite(favorite)
        })
    }

    const handleShipItems = () => {
        favoriteReducer.favorites.map((favorite) => {
            const favoriteToShip = {
                authorId: favorite.authorId,
                categoryId: favorite.categoryId,
                label: favorite.label,
                tagId: favorite.tagId,
            }
            createTodo(favoriteToShip)
            uncheckFavorites()

            // Redirect to the home page
            navigate("/")
        })
    }

    if (!authId) return <Navigate to="/signin" />

    if (myCategories && myCategories.length === 0) {
        return (
            <div className="dashboard container">
                <Toolbar />
                <div className="row">
                    <Typography
                        component="h3"
                        variant="h4"
                        style={{ marginTop: '4rem', textAlign: 'center' }}
                    >
                        You have not defined categories yet!
                    </Typography>
                    <Typography
                        component="h3"
                        variant="h5"
                        style={{ marginTop: '3rem', textAlign: 'center' }}
                    >First, navigate to the
                        <animated.span className="test" style={animationStyles}>
                            <NavLink to="/categories"> Categories </NavLink>
                        </animated.span>
                        page and create your first category!
                    </Typography>
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard container">
            <Toolbar />
            <div className="row">
                <Box sx={{ display: 'flex', mt: 2, mb: 2, justifyContent: 'end', }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        endIcon={<AddCircleOutlineIcon fontSize='large' />}
                        disabled={isCartEmpty}
                        onClick={handleShipItems}
                    >
                        Ship items
                    </Button>
                </Box>
                <CategoriesTags />
                <InputCart />
                {myFavorites?.map((favorite, index) => {
                    return (
                        favorite.categoryId === categorySelected.id &&
                            favorite.tagId === tagSelected.id
                            ? <Cart
                                key={favorite.id}
                                favorite={favorite}
                            />
                            : ''
                    )
                })}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        categories: state.firestore.ordered.categories,
        favorites: state.firestore.ordered.favorites,
        categorySelected: state.categorySelected,
        tagSelected: state.tagSelected,
        favoriteReducer: state.favorite
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        definePageTitle: (title) => dispatch(definePageTitle(title)),
        createTodo: (todo) => dispatch(createTodo(todo)),
        actionUncheckFavorite: (favorite) => dispatch(uncheckFavorite(favorite)),
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'favorites', orderBy: ['createdAt', 'desc'] },
    ])
)(CartPage)