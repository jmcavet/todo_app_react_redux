import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { deleteTagAction } from '../../store/actions/tagActions'
import { selectTagAction } from '../../store/actions/tagActions'
import { reverseColor, rgbCode } from '../../helper/color';

import moment from 'moment'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, Paper } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

const Tag = ({ tag, setOpenTagDialog, tags, categorySelected, selectTagAction, deleteTagAction }) => {

    const [categoryColor, setCategoryColor] = useState('')

    useEffect(() => {
        console.log("categorySelected has changed: ", categorySelected)
        setCategoryColor(categorySelected.color)
    }, [categorySelected])

    const deleteTag = () => deleteTagAction(tag.id)

    const updateTag = (e) => {
        // 1. Record the tag that has been selected
        // 2. Open the Dialog for updating tags
        const tagId = tag.id
        const tagToUpdate = tags.filter(tag => tag.id === tagId)[0]

        selectTagAction({
            id: tagId,
            label: tagToUpdate.label
        })

        setOpenTagDialog(true)
    }

    return (
        <Grid xs={12} item>
            <Paper
                elevation={2}
                style={{
                    background: `${rgbCode(categoryColor)}`,
                    color: `${reverseColor(categoryColor)}`,
                    margin: "auto", padding: 10,
                    display: "flex", alignItems: "center",
                    marginTop: 10,
                    width: 500
                }}>
                <span style={{ fontSize: "1.3rem" }}>{tag.label}</span>
                <IconButton
                    style={{ marginLeft: "auto", color: reverseColor(categoryColor) }}
                    aria-label="Edit"
                    onClick={updateTag}
                >
                    <EditIcon fontSize="medium" />
                </IconButton>
                <IconButton
                    style={{ color: reverseColor(categoryColor) }}
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
        categorySelected: state.categorySelected,
        tags: state.firestore.ordered.tags,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectTagAction: (tag) => dispatch(selectTagAction(tag)),
        deleteTagAction: (tag) => dispatch(deleteTagAction(tag)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tag)