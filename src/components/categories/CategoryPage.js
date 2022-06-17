import React, { useState } from 'react'
import Toolbar from "@material-ui/core/Toolbar";
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Navigate } from 'react-router-dom'
import Categories from '../categories/Categories';
import CreateCategory from '../categories/CreateCategory';
import DialogCategoryEdit from './DialogCategoryEdit';
import DialogTagEdit from '../tags/DialogTagEdit';
import Spinner from '../layout/Spinner';

const CategoryPage = (props) => {
    const [openDialog, setOpenDialog] = useState(false)
    const [openTagDialog, setOpenTagDialog] = useState(false)

    const { auth, tags } = props

    if (!auth.uid) return <Navigate to="/signin" />

    return (
        <div className="dashboard container">
            <Toolbar />
            <div className="row">
                <CreateCategory />
                <Spinner />
            </div>
            <DialogCategoryEdit
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
            />
            <div className="row">
                <Categories
                    tags={tags}
                    setOpenDialog={setOpenDialog}
                    setOpenTagDialog={setOpenTagDialog}
                />
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
        categories: state.firestore.ordered.categories,
        tags: state.firestore.ordered.tags,
    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'categories', orderBy: ['createdAt', 'asc'] },
        { collection: 'tags', orderBy: ['createdAt', 'desc'] }
    ])
)(CategoryPage)