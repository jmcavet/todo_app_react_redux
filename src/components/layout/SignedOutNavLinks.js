import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { signOut } from '../../store/actions/authActions';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import AddIcCallIcon from '@material-ui/icons/AddIcCall';
import InfoIcon from '@material-ui/icons/Info';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FaceIcon from '@material-ui/icons/Face';

const useStyles = makeStyles(theme => ({
    navlink: {
        color: '#000088',
        fontSize: '1.3rem',
    }
}));

const SignedOutNavLinks = () => {

    const classes = useStyles();

    return (
        <List>
            {/* <ListItem button key="Home">
                <ListItemIcon><HomeIcon fontSize="large" /></ListItemIcon>
                <NavLink to="/" className={classes.navlink}>Home</NavLink>
            </ListItem> */}
            <ListItem button key="Signin">
                <ListItemIcon><FaceIcon fontSize="large" /></ListItemIcon>
                <NavLink to="/signin" className={classes.navlink}>Sign In</NavLink>
            </ListItem>
        </List>
    );
}

export default SignedOutNavLinks;