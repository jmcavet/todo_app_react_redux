import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { connect } from 'react-redux';
import { signOut } from '../../store/actions/authActions';
import SignedInNavLinks from "./SignedInNavLinks";
import SignedOutNavLinks from "./SignedOutNavLinks";

const drawerWidth = 200;

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

const MyDrawer = (props) => {
    const classes = useStyles();

    const links = props.auth.uid ? <SignedInNavLinks /> : <SignedOutNavLinks />;

    return (
        <Drawer
            className={classes.drawer}
            variant={props.isMdUp ? "permanent" : "temporary"}
            classes={{
                paper: classes.drawerPaper
            }}
            anchor="left"
            open={props.open}
            onClose={props.toggleDrawer}
        >
            <div className={classes.toolbar} />
            {links}
        </Drawer>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut())
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyDrawer);

// export default MyDrawer;
