import React, { useState } from 'react'
import { connect } from 'react-redux'
import { createTag } from '../../store/actions/tagActions'
import MySnackBar from '../layout/MySnackBar';

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';



const InputTag = (props) => {
    const { tags, createTag, categoryId } = props;

    const [state, setState] = useState({ label: '' });
    const [text, setText] = useState('');

    const [dialogMessage, setDialogMessage] = useState({ text: '', severity: '' })
    const [openWarningDialog, setOpenWarningDialog] = useState(false)

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
        const duplicateTags = tags.filter((tag) => tag.categoryId === categoryId && tag.label === state.label)

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
                    mt: '.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    width: "100%"
                }}
                onSubmit={handleSubmit}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Add new Tag"
                    inputProps={{ 'aria-label': 'add new tag' }}
                    id="label"
                    value={text}
                    onChange={handleChange}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Add
                </Button>
            </Paper>
        </div>

    );
}

const mapStateToProps = (state) => {
    return {
        tags: state.firestore.ordered.tags,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createTag: (tag) => dispatch(createTag(tag))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputTag)

