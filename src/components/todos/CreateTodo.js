import React from 'react'

import { Divider, Paper } from '@mui/material'

import CategoryChips from '../categories/CategoryChips'
import TagChips from '../tags/TagChips'
import InputTodo from './InputTodo'

const CreateTodo = () => {
    const myStyle = {
        paper: { p: '.5rem .5rem', width: "100%", background: 'rgb(253, 253, 253)' },
        dividerCategories: {
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '.8rem',
        },
        dividerTags: {
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginTop: '1.2rem',
            marginBottom: '.8rem',
        },
        divider: { marginBottom: "1rem" },
    }

    return (
        <Paper
            elevation={3}
            sx={myStyle.paper}
        >
            <div>
                <Divider style={myStyle.dividerCategories}>Select Category</Divider>
                <CategoryChips />
            </div>
            <div>
                <Divider style={myStyle.dividerTags}>Select Tag</Divider>
                <TagChips />
            </div>
            <InputTodo />
        </Paper>
    )
}

export default CreateTodo