import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { Paper, InputBase, Button } from '@mui/material'

import MySnackBar from '../layout/MySnackBar'
import { createTag } from '../../store/actions/tagActions'

const InputTag = ({
    categoryId,
    auth, tags,
    createTag
}) => {
    const [state, setState] = useState({ label: '' });
    const [text, setText] = useState('');
    const authId = auth.uid
    const [myTags, setMyTags] = useState(null)
    const [dialogMessage, setDialogMessage] = useState({ text: '', severity: '' })
    const [openWarningDialog, setOpenWarningDialog] = useState(false)

    useEffect(() => {
        if (tags) {
            const tagsFiltered = tags.filter(tag => tag.authorId === authId)
            setMyTags(tagsFiltered)
        }
    }, [authId, tags])

    const handleChange = (e) => {
        setText(e.target.value)

        setState(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
            categoryId,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Find if the tag entered by User already exists
        const duplicateTags = myTags?.filter(tag => {
            return (
                tag.categoryId === categoryId &&
                tag.label === state.label
            )
        })

        if (duplicateTags.length > 0) {
            setDialogMessage(prevState => ({
                ...prevState,
                text: `Tag ${state.label} already exists!`,
                severity: 'error'
            }))
            setOpenWarningDialog(true)
        } else {
            createTag(state)

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
                sx={{
                    p: '2px 2px',
                    display: 'flex',
                    alignItems: 'center',
                    width: "100%"
                }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Add new Tag"
                    inputProps={{ 'aria-label': 'add new tag' }}
                    autoComplete="off"
                    value={text}
                    onChange={handleChange}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    type="submit"
                >
                    Add
                </Button>
            </Paper>
        </div>

    );
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        tags: state.firestore.ordered.tags,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createTag: (tag) => dispatch(createTag(tag))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputTag)

