import React, { useState } from 'react'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';

export default function InputCategory({ createCategory }) {
    const [state, setState] = useState({ label: '' });
    const [text, setText] = useState('');

    const handleChange = (e) => {
        setText(e.target.value)

        setState(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        createCategory(state)

        // Clear text
        setText('')
    }

    return (
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%" }}
            onSubmit={handleSubmit}
        >
            <InputBase
                sx={{ ml: 1, flex: 1, width: "90%" }}
                placeholder="Add new Category"
                inputProps={{ 'aria-label': 'add new category' }}
                id="label"
                value={text}
                onChange={handleChange}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ width: "10%" }}
            >
                Add
            </Button>
        </Paper>
    );
}