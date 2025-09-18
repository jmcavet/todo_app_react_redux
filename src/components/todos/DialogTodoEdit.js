import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'

import { updateTodoAction } from '../../store/actions/todoActions'

const DialogTodoEdit = ({
    openTodoDialog, setOpenTodoDialog,
    todoSelected,
    updateTodoAction
}) => {
    const [stateTodo, setStateTodo] = useState({})

    useEffect(() => {
        setStateTodo(prevState => ({
            ...prevState,
            id: todoSelected.id,
            oldLabel: todoSelected.label,
            label: todoSelected.label
        }))
    }, [todoSelected])

    const handleClose = () => {
        // Close dialog window
        setOpenTodoDialog(false)

        // If use enters new label but cancel/close dialog:
        // reset the label to the original one
        setStateTodo(prevState => ({
            ...prevState,
            label: todoSelected.label,
        }))
    };

    const handleTodoChange = (e) => {
        setStateTodo(prevState => ({
            ...prevState,
            label: e.target.value,
        }))
    }

    const handleUpdate = (e) => {
        e.preventDefault()

        updateTodoAction(stateTodo)

        // Close dialog window
        setOpenTodoDialog(false)
    }

    return (
        <div>
            <Dialog
                open={openTodoDialog}
                onClose={handleClose}
                onKeyUp={(e) => {
                    if (e.key === 'Enter') handleUpdate(e)
                }}
            >
                <DialogTitle>Modify Todo</DialogTitle>
                <DialogContent style={{ paddingBottom: '0rem' }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="label"
                        label="Todo"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={stateTodo.label}
                        onChange={handleTodoChange}
                    />
                    {todoSelected.error ? <p>{todoSelected.error}</p> : null}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ background: '#02951A' }}
                        endIcon={<CheckIcon fontSize='large' />}
                        onClick={handleUpdate}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        todoSelected: state.todo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateTodoAction: (todo) => dispatch(updateTodoAction(todo)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogTodoEdit)