import React from "react"

import useMediaQuery from "@material-ui/core/useMediaQuery"
import CssBaseline from "@material-ui/core/CssBaseline"
import { makeStyles, useTheme } from "@material-ui/core/styles"

import Appbar from "./Appbar"
import MyDrawer from "./Drawer"

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },
}));

const MainLayout = ({
    children
}) => {
    const classes = useStyles()
    const theme = useTheme()
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Appbar />
            <MyDrawer isMdUp={isMdUp} />
            {children}
        </div>
    );
}

export default MainLayout