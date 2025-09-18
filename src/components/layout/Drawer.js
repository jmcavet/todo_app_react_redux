import React from 'react'
import { connect } from 'react-redux'

import { makeStyles } from "@material-ui/core/styles"

import Drawer from "@material-ui/core/Drawer"

import SignedInNavLinks from "./SignedInNavLinks"
import SignedOutNavLinks from "./SignedOutNavLinks"
import { openCloseDrawer } from '../../store/actions/drawerActions'

const drawerWidth = 200

const useStyles = makeStyles(theme => ({
    drawer: {
        flexShrink: 0,
        width: drawerWidth
    },
    drawerPaper: {
        width: drawerWidth
    },
    toolbar: {
        ...theme.mixins.toolbar,
        [theme.breakpoints.down("sm")]: {
            display: "none"
        }
    },
    navlink: {
        color: '#000088',
        fontSize: '1.3rem',
    }
}));

const MyDrawer = ({
    isMdUp,
    auth, drawer,
    openCloseDrawer, }
) => {
    const classes = useStyles();

    const authId = auth.uid
    const links = authId ? <SignedInNavLinks /> : <SignedOutNavLinks />

    return (
        <Drawer
            className={classes.drawer}
            variant={isMdUp ? "permanent" : "temporary"}
            classes={{
                paper: classes.drawerPaper
            }}
            anchor="left"
            open={drawer.open}
            onClose={(e) => openCloseDrawer(!drawer.open)}
        >
            <div className={classes.toolbar} />
            {links}
        </Drawer>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        drawer: state.drawer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        openCloseDrawer: (payload) => dispatch(openCloseDrawer(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyDrawer)
