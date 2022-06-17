import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { signOut } from '../../store/actions/authActions';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import HomeIcon from '@material-ui/icons/Home';
import CategoryIcon from '@mui/icons-material/Category';
import AddIcCallIcon from '@material-ui/icons/AddIcCall';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import StarIcon from '@mui/icons-material/Star';

const useStyles = makeStyles(theme => ({
    navlink: {
        color: '#000088',
        fontSize: '1.3rem',
    }
}));

const SignedInNavLinks = (props) => {

    const classes = useStyles();

    return (
        <List>
            {/* {links} */}
            <ListItem button key="Home">
                <ListItemIcon><HomeIcon fontSize="large" /></ListItemIcon>
                <NavLink to="/" className={classes.navlink}>Home</NavLink>
            </ListItem>
            <ListItem button key="Categories">
                <ListItemIcon><CategoryIcon fontSize="large" /></ListItemIcon>
                <NavLink to="/categories" className={classes.navlink}>Categories</NavLink>
            </ListItem>
            <ListItem button key="Favourites">
                <ListItemIcon><StarIcon fontSize="large" /></ListItemIcon>
                <NavLink to="/favourites" className={classes.navlink}>Favourites</NavLink>
            </ListItem>
            <ListItem button key="Contact">
                <ListItemIcon><AddIcCallIcon fontSize="large" /></ListItemIcon>
                <NavLink to="/create" className={classes.navlink}>Contact</NavLink>
            </ListItem>
            <ListItem button key="Logout">
                <ListItemIcon><ExitToAppIcon fontSize="large" /></ListItemIcon>
                <a onClick={props.signOut} className={classes.navlink}>Log Out</a>
            </ListItem>
        </List>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut())
    }
}

export default connect(null, mapDispatchToProps)(SignedInNavLinks);