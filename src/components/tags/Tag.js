import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { Grid, Paper, IconButton } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import { deleteTagAction } from '../../store/actions/tagActions'
import { selectTagAction } from '../../store/actions/tagActions'
import { reverseColor, rgbCode } from '../../helper/color'
import LoadingLinearProgress from '../layout/LoadingLinearProgress'

const Tag = ({
    tag, setOpenTagDialog,
    auth, tags, categorySelected,
    selectTagAction, deleteTagAction
}) => {
    const [categoryColor, setCategoryColor] = useState(null)
    const [myTags, setMyTags] = useState(null)
    const authId = auth.uid

    useEffect(() => {
        setCategoryColor(categorySelected.color)
    }, [categorySelected])

    useEffect(() => {
        if (authId && tags) {
            const tagsFiltered = tags.filter(tag => tag.authorId === authId)
            setMyTags(tagsFiltered)
        }
    }, [authId, tags])

    const deleteTag = () => deleteTagAction(tag.id)

    const updateTag = (e) => {
        // 1. Record the tag that has been selected
        // 2. Open the Dialog for updating tags
        const tagId = tag.id
        const tagToUpdate = myTags?.filter(tag => tag.id === tagId)[0]

        selectTagAction({
            id: tagId,
            label: tagToUpdate.label,
            categoryId: tagToUpdate.categoryId,
        })
        setOpenTagDialog(true)
    }

    if (!myTags && !categoryColor) return null

    const myStyle = {
        paper: {
            background: `${rgbCode(categoryColor)}`,
            color: `${reverseColor(categoryColor)}`,
            margin: "auto", paddingLeft: 10, paddingRight: 10,
            display: "flex", alignItems: "center",
            marginTop: 10,
        },
        span: { fontSize: "1.3rem" },
        iconBtnEdit: { marginLeft: "auto", color: reverseColor(categoryColor) },
        iconBtnDelete: { color: reverseColor(categoryColor) }
    }

    return (
        <Grid xs={12} item>
            <Paper
                elevation={4}
                style={myStyle.paper}
            >
                <span style={myStyle.span}>{tag.label}</span>
                <IconButton
                    style={myStyle.iconBtnEdit}
                    aria-label="Edit"
                    onClick={updateTag}
                >
                    <EditIcon fontSize="medium" />
                </IconButton>
                <IconButton
                    style={myStyle.iconBtnDelete}
                    aria-label="Delete"
                    onClick={deleteTag}
                >
                    <DeleteIcon fontSize="medium" />
                </IconButton>
            </Paper>
        </Grid>
    );
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        tags: state.firestore.ordered.tags,
        categorySelected: state.categorySelected,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectTagAction: (tag) => dispatch(selectTagAction(tag)),
        deleteTagAction: (tag) => dispatch(deleteTagAction(tag)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tag)