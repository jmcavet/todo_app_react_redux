import React from 'react'
import { NavLink } from 'react-router-dom'

import { makeStyles } from "@material-ui/core/styles"

import { List, ListItem, ListItemIcon } from "@mui/material"
import FaceIcon from '@material-ui/icons/Face'

const useStyles = makeStyles(theme => ({
    navlink: {
        color: '#091b78',
        fontSize: '1.3rem',
    }
}))

const SignedOutNavLinks = () => {
    const classes = useStyles();

    return (
        <List>
            <ListItem button key="Signin">
                <ListItemIcon><FaceIcon fontSize="large" /></ListItemIcon>
                <NavLink to="/signin" className={classes.navlink}>Sign In</NavLink>
            </ListItem>
        </List>
    )
}

export default SignedOutNavLinks