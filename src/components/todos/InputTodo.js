import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { Paper, Button, InputBase } from '@mui/material'

import { createTodo } from '../../store/actions/todoActions'
import MySnackBar from '../layout/MySnackBar'

const InputTodo = ({
    auth, todos, tags, tagSelected, categorySelected,
    createTodo
}) => {
    const [state, setState] = useState({})
    const [text, setText] = useState('')
    const [dialogMessage, setDialogMessage] = useState({ text: '', severity: '' })
    const [openWarningDialog, setOpenWarningDialog] = useState(false)
    const [areCategoryAndTagUndefined, setAreCategoryAndTagUndefined] = useState(false)
    const authId = auth.uid

    useEffect(() => {
        if (authId && tags && categorySelected) {

            const myCategoryTags = tags.filter(tag => {
                return (
                    tag.authorId === authId &&
                    tag.categoryId === categorySelected.id
                )
            })

            if (myCategoryTags.length > 0) setAreCategoryAndTagUndefined(false)
            else setAreCategoryAndTagUndefined(true)
        }
    }, [authId, tags, categorySelected])

    const handleChange = (e) => {
        setText(e.target.value)

        setState(prevState => ({
            ...prevState,
            label: e.target.value,
            tagId: tagSelected.id,
            // categoryId: tagSelected.categoryId,
            categoryId: categorySelected.id,
            isFavorite: false,
        }))
    }

    const handleAddTodo = (e) => {
        e.preventDefault()

        // Find if the tag entered by User already exists
        const duplicateTodos = todos.filter((todo) => {
            return (
                todo.authorId === authId &&
                todo.tagId === tagSelected.id &&
                todo.label === state.label
            )
        })

        if (duplicateTodos.length > 0) {
            setDialogMessage(prevState => ({
                ...prevState,
                text: `Todo ${state.label} already exists!`,
                severity: 'error'
            }))
            setOpenWarningDialog(true)
        } else {
            createTodo(state)

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
                    placeholder="Add new Todo"
                    inputProps={{ 'aria-label': 'add new todo' }}
                    autoComplete="off"
                    value={text}
                    onChange={handleChange}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddTodo}
                    disabled={areCategoryAndTagUndefined}
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
        todos: state.firestore.ordered.todos,
        tags: state.firestore.ordered.tags,
        tagSelected: state.tagSelected,
        categorySelected: state.categorySelected
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createTodo: (todo) => dispatch(createTodo(todo))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputTodo)