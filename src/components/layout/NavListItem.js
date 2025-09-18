import React from 'react'
import { NavLink } from 'react-router-dom'

import { makeStyles } from "@material-ui/core/styles"

import { ListItem, ListItemIcon } from "@mui/material"

const useStyles = makeStyles(theme => ({
    navlink: {
        color: '#091b78',
        fontSize: '1.3rem',
    },
    navText: {
        color: '#091b78',
        marginLeft: '1.5rem'
    }
}));

const NavListItem = ({
    text, navLinkTo, icon, closeDrawer,
}) => {
    const classes = useStyles()

    return (
        <ListItem button key={text} onClick={closeDrawer}>
            <NavLink to={navLinkTo} className={classes.navlink}>
                <ListItemIcon>
                    {icon}
                    <div className={classes.navText}>{text}</div>
                </ListItemIcon>
            </NavLink>
        </ListItem>
    )
}

export default NavListItem