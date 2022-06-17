import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import { RgbaColorPicker } from "react-colorful";
import { reverseColor, rgbCode } from '../../helper/color';


export default function DialogInputCategory({ createCategory, selectCategory }) {
    const [open, setOpen] = useState(false)
    const [state, setState] = useState({});
    const [category, setCategory] = useState('')
    const [color, setColor] = useState({ r: 10, g: 25, b: 135, a: 0.8 });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        // Clear Dialog text field
        setCategory('')

        setOpen(false);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value)

        setState(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
            color: color
        }))
    }

    const onChangeColor = (c) => {
        setColor(c)

        setState(prevState => ({
            ...prevState,
            color: c
        }))
    }

    const handleApply = (e) => {
        createCategory(state)

        selectCategory(state)

        // Clear Dialog text field
        setCategory('')

        // Close dialog window
        setOpen(false);
    };

    return (
        <div>
            <Button
                variant="contained"
                style={{ background: '#02951A' }}
                endIcon={<AddCircleOutlineIcon fontSize='large' />}
                onClick={handleClickOpen}
            >
                Add Category
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add a new category</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="label"
                        label="Category"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={category}
                        onChange={handleCategoryChange}
                    />
                    <br />
                    <br />
                    <Box
                        display="flex"
                        justifyContent="center"
                        style={{ marginTop: '2rem' }}
                    >
                        <RgbaColorPicker
                            color={color}
                            onChange={onChangeColor}
                        />
                    </Box>
                    <p
                        style={{
                            background: rgbCode(color),
                            color: reverseColor(color),
                            fontSize: '1.3rem',
                            padding: '1rem',
                            textAlign: 'center'
                        }}
                    >
                        {category}
                    </p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        style={{ background: '#02951A' }}
                        endIcon={<CheckIcon fontSize='large' />}
                        onClick={handleApply}
                    >
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
