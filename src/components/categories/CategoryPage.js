import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { useSpring, animated } from 'react-spring'

import { Toolbar, Box } from "@mui/material"

import Categories from '../categories/Categories'
import DialogInputCategory from './DialogInputCategory'
import DialogCategoryEdit from './DialogCategoryEdit'
import DialogTagEdit from '../tags/DialogTagEdit'
import Spinner from '../layout/Spinner'
import LoadingLinearProgress from '../layout/LoadingLinearProgress'
import InputTag from '../tags/InputTag'
import Tag from '../tags/Tag'

import { definePageTitle } from '../../store/actions/settingsActions'

const style = {
    message: {
        textAlign: 'center',
        margin: '2.5rem',
    },
    boxInputTag: {
        width: "100%",
        bgcolor: 'background.paper',
        borderColor: 'divider'
    }
}

const CategoryPage = ({
    auth, tags, categories, categorySelected,
    definePageTitle
}) => {
    useEffect(() => {
        definePageTitle({
            pageTitle: "Categories",
        })
    }, [])

    const [openDialog, setOpenDialog] = useState(false)
    const [openTagDialog, setOpenTagDialog] = useState(false)

    const animationStyles = useSpring({
        from: { opacity: "0.2", color: 'red', transform: "translateX(-1rem)" },
        to: [
            { opacity: "1", color: 'blue', transform: "translateX(1rem)" },
            { opacity: "0.2", color: 'green', transform: "translateX(-1rem)" }
        ],
        config: { duration: "1500" },
        loop: true,
    })

    // Initialize tags & categories belonging to the user
    const [myTags, setMyTags] = useState(null)
    const [myCategories, setMyCategories] = useState(null)
    const authId = auth.uid

    useEffect(() => {
        if (authId && tags && categories) {
            console.log("Categories Page: data is now available...")

            // Get only documents belonging to the user
            const tagsFiltered = tags.filter(tag => tag.authorId === authId)
            setMyTags(tagsFiltered)

            const categoriesFiltered = categories.filter(category => category.authorId === authId)
            setMyCategories(categoriesFiltered)
        }
    }, [authId, tags, categories])

    if (!authId) return <Navigate to="/signin" />

    if ((!myTags) || (!myCategories)) return null

    if ((myCategories.length === 0)) {
        return (
            <div className="dashboard container">
                <Toolbar />
                <div className="row">
                    <animated.div className="test" style={animationStyles}>
                        <h5 style={style.message}>Start creating a new Category!</h5>
                    </animated.div>
                    <DialogInputCategory />
                    <Spinner />
                </div>
                <DialogCategoryEdit
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                />
                <div className="row">
                    <Categories
                        categories={myCategories}
                        setOpenDialog={setOpenDialog}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard container">
            <Toolbar />
            <div className="row">
                <DialogInputCategory />
                <Spinner />
            </div>
            <DialogCategoryEdit
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
            />
            <div className="row">
                <Categories
                    categories={myCategories}
                    setOpenDialog={setOpenDialog}
                />
                <Box style={style.boxInputTag}>
                    <InputTag categoryId={categorySelected.id} />
                    {myTags?.map((tag, index) => {
                        return (
                            tag.categoryId === categorySelected.id
                                ? <Tag
                                    tag={tag}
                                    setOpenTagDialog={setOpenTagDialog}
                                    key={tag.id} />
                                : ''
                        )
                    })}
                </Box>
            </div>
            <DialogTagEdit
                openTagDialog={openTagDialog}
                setOpenTagDialog={setOpenTagDialog}
            />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        tags: state.firestore.ordered.tags,
        categories: state.firestore.ordered.categories,
        categorySelected: state.categorySelected,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        definePageTitle: (title) => dispatch(definePageTitle(title))
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'tags', orderBy: ['createdAt', 'desc'] },
        { collection: 'categories', orderBy: ['createdAt', 'desc'] }
    ])
)(CategoryPage)
