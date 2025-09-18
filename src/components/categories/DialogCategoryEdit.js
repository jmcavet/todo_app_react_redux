import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { RgbaColorPicker } from "react-colorful"

import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

import { updateCategoryAction } from '../../store/actions/categoryActions'
import { deleteCategoryAction } from '../../store/actions/categoryActions'
import { reverseColor, rgbCode } from '../../helper/color'

const DialogCategoryEdit = ({
    openDialog, setOpenDialog,
    categorySelected,
    updateCategoryAction, deleteCategoryAction,
}) => {
    const [stateCategory, setStateCategory] = useState(
        {
            oldLabel: categorySelected.label,
            label: categorySelected.label,
            color: { r: 10, g: 25, b: 135, a: 0.8 },
            id: categorySelected.id
        }
    )

    useEffect(() => {
        setStateCategory(prevState => ({
            ...prevState,
            oldLabel: categorySelected.label,
            label: categorySelected.label
        }))
    }, [categorySelected.label])

    useEffect(() => {
        setStateCategory(prevState => ({
            ...prevState,
            color: categorySelected.color
        }))
    }, [categorySelected.color])

    useEffect(() => {
        setStateCategory(prevState => ({
            ...prevState,
            id: categorySelected.id
        }))
    }, [categorySelected.id])

    const handleClose = () => {
        // Close dialog window
        setOpenDialog(false)

        // If use enters new label but cancel/close dialog:
        // reset the label to the original one
        setStateCategory(prevState => ({
            ...prevState,
            label: categorySelected.label,
        }))
    };

    const handleCategoryChange = (e) => {
        setStateCategory(prevState => ({
            ...prevState,
            label: e.target.value,
        }))
    }

    const onChangeColor = (c) => {
        setStateCategory(prevState => ({
            ...prevState,
            color: c
        }))
    }

    const handleUpdate = (e) => {
        updateCategoryAction(stateCategory)

        // Close dialog window
        setOpenDialog(false)
    };

    const handleDelete = (e) => {
        deleteCategoryAction(stateCategory.id)

        // Close dialog window
        setOpenDialog(false);
    };

    return (
        <div>
            <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle>Modify category</DialogTitle>
                <DialogContent style={{ paddingBottom: '0rem' }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="label"
                        label="Category"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={stateCategory.label}
                        onChange={handleCategoryChange}
                    />
                    {categorySelected.error ? <p>{categorySelected.error}</p> : null}
                    <Box
                        display="flex"
                        justifyContent="center"
                        style={{ marginTop: '1rem' }}
                    >
                        <RgbaColorPicker
                            color={stateCategory.color}
                            onChange={onChangeColor}
                        />
                    </Box>
                    <p
                        style={{
                            background: stateCategory.color ? rgbCode(stateCategory.color) : 'red',
                            color: stateCategory.color ? reverseColor(stateCategory.color) : 'white',
                            fontSize: '1.3rem',
                            padding: '1rem',
                            margin: '1rem 0 1rem',
                            textAlign: 'center'
                        }}
                    >
                        {stateCategory.label}
                    </p>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ background: 'red' }}
                        endIcon={<DeleteOutlineIcon fontSize='large' />}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
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
    );
}

const mapStateToProps = (state) => {
    return {
        categorySelected: state.categorySelected
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateCategoryAction: (category) => dispatch(updateCategoryAction(category)),
        deleteCategoryAction: (categoryId) => dispatch(deleteCategoryAction(categoryId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogCategoryEdit)