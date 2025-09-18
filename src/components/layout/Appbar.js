
import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

import AppBar from "@material-ui/core/AppBar"
import { Toolbar, Box, IconButton, Typography } from "@mui/material"
import { makeStyles } from "@material-ui/core/styles"
import MenuIcon from "@material-ui/icons/Menu"

import { openCloseDrawer } from '../../store/actions/drawerActions'
import Logo from '../../assets/logo.png'

const useStyles = makeStyles(theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        background: '#091b78'
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up("md")]: {
            display: "none"
        }
    },
    familiapp: {
        marginLeft: '1.2rem',
        color: 'white',
        fontSize: '1.5rem'
    }
}));

const Appbar = ({ drawer, settings, openCloseDrawer }) => {
    const classes = useStyles();

    const toggleDrawer = () => openCloseDrawer(!drawer.open)

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={toggleDrawer}
                    className={classes.menuButton}
                >
                    <MenuIcon />
                </IconButton>
                <NavLink className={classes.familiapp} style={{ display: 'flex' }} to="/" >
                    <Box
                        component="img"
                        sx={{ maxHeight: 50 }}
                        alt="Famili Logo"
                        src={Logo}
                    />
                </NavLink>
                <Typography variant="h5" style={{ marginLeft: "auto", textAlign: 'center' }}>
                    {settings.pageTitle}
                </Typography>
            </Toolbar>
        </AppBar >
    )
}

const mapStateToProps = (state) => {
    return {
        drawer: state.drawer,
        settings: state.settings
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        openCloseDrawer: (payload) => dispatch(openCloseDrawer(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Appbar)