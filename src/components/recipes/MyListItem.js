import React from 'react'

import { IconButton, ListItem, ListItemText } from "@mui/material"

import DeleteIcon from '@mui/icons-material/Delete'

const style = {
    listItem: {
        backgroundColor: 'rgb(245, 245, 245)',
        marginBottom: '.5rem'
    },
    iconBtn: { color: 'red' }
}

const MyListItem = ({
    variable, variables, setVariables, index = null
}) => {
    const deleteItem = () => {
        setVariables(variables.filter(eachVariable => eachVariable !== variable))
    }

    const text = index !== null ? index + 1 + ". " + variable : variable

    return (
        <ListItem
            secondaryAction={
                <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={e => deleteItem(e, variable)}
                    key={variable}
                    style={style.iconBtn}
                >
                    <DeleteIcon />
                </IconButton>
            }
            style={style.listItem}
        >
            <ListItemText primary={text} />
        </ListItem>
    );
}

export default MyListItem