import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CssBaseline from "@material-ui/core/CssBaseline";
import Appbar from "./Appbar";
import MyDrawer from "./Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import CentralComponent from "./CentralComponent";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },
}));

const MainLayout = ({ children }) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

    const [open, setOpen] = React.useState(false);

    const toggleDrawer = event => setOpen(!open);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Appbar toggleDrawer={toggleDrawer} />
            <MyDrawer open={open} isMdUp={isMdUp} toggleDrawer={toggleDrawer} />
            {/* <CentralComponent /> */}
            {children}
        </div>
    );
}

export default MainLayout;