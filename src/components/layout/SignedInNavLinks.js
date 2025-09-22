import React from "react";
import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";

import { List, ListItem, ListItemIcon } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import EventNoteIcon from "@mui/icons-material/EventNote";

import NavListItem from "./NavListItem";
import { signOut } from "../../store/actions/authActions";
import { openCloseDrawer } from "../../store/actions/drawerActions";

const useStyles = makeStyles((theme) => ({
  navlink: {
    color: "#091b78",
    fontSize: "1.3rem",
  },
  navText: {
    color: "#091b78",
    marginLeft: "1.5rem",
  },
}));

const SignedInNavLinks = ({ drawer, signOut, openCloseDrawer }) => {
  const classes = useStyles();

  const closeDrawer = () => {
    if (drawer.open) openCloseDrawer(false);
  };

  const mySignOut = () => {
    closeDrawer();
    signOut();
  };

  return (
    <List>
      <NavListItem
        text="Home"
        navLinkTo="/"
        icon={<HomeIcon fontSize="large" />}
        closeDrawer={closeDrawer}
      />
      <NavListItem
        text="Categories"
        navLinkTo="/categories"
        icon={<CategoryIcon fontSize="large" />}
        closeDrawer={closeDrawer}
      />
      <NavListItem
        text="Cart"
        navLinkTo="/cart"
        icon={<ShoppingCartIcon fontSize="large" />}
        closeDrawer={closeDrawer}
      />
      <NavListItem
        text="Recipes"
        navLinkTo="/recipes"
        icon={<RestaurantIcon fontSize="large" />}
        closeDrawer={closeDrawer}
      />
      <NavListItem
        text="Meal planner"
        navLinkTo="/cookingAgenda"
        icon={<EventNoteIcon fontSize="large" />}
        closeDrawer={closeDrawer}
      />
      <NavListItem
        text="Contact"
        navLinkTo="/contact"
        icon={<AddIcCallIcon fontSize="large" />}
        closeDrawer={closeDrawer}
      />
      <ListItem button key="Logout" onClick={closeDrawer}>
        <a onClick={mySignOut} className={classes.navlink}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="large" />
            <div className={classes.navText}>Log Out</div>
          </ListItemIcon>
        </a>
      </ListItem>
    </List>
  );
};

const mapStateToProps = (state) => {
  return {
    drawer: state.drawer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut()),
    openCloseDrawer: (payload) => dispatch(openCloseDrawer(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignedInNavLinks);
