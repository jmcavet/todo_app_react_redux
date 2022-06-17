import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3)
    },
}));

const CentralComponent = () => {
    const classes = useStyles();

    return (
        <main className={classes.content}>
            <Toolbar />
            <Typography component="h2" variant="h6" gutterBottom>
                On small and extra-small screens the sidebar/drawer is temporary and
                can be opened via the menu icon in the toolbar.
            </Typography>
            <Typography component="h2" variant="h6" gutterBottom>
                On medium, large, and extra-large screens the sidebar/drawer is
                permanent and there is no menu icon in the toolbar.
            </Typography>
            <hr />
            <Typography paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
                dolor purus non enim praesent elementum facilisis leo vel. Risus at
                ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
                quisque non tellus.
            </Typography>
        </main>
    )
}

export default CentralComponent;
