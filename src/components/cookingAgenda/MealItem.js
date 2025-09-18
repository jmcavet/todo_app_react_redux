import React, { useState } from "react";
import { connect } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  MenuItem,
  Menu,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MealDialog from "./MealDialog";
import { deleteMealAction } from "../../store/actions/mealActions";

const style = {
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    color: "#0a1b79",
    borderBottom: 0,
    borderBottomLeftRadius: "5px",
    borderBottomRightRadius: "5px",
  },
  text: {
    marginLeft: ".5rem",
    textAlign: "left",
  },
  iconBtn: { marginLeft: "auto" },
  iconView: { color: "#0d7c0d" },
};

const MealItem = ({ meal, auth, deleteMealAction }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const openMenu = Boolean(anchorEl);

  const authId = auth.uid;

  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);

  const handleEditMeal = () => {
    setOpenDialog(true);
    handleCloseMenu();
  };

  const handleRemoveMeal = () => {
    deleteMealAction(meal.id);
    handleCloseMenu();
  };

  const handleCloseMenu = () => setAnchorEl(null);

  const viewRecipe = () => {
    // Redirect to the this specific recipe page
    navigate(`/recipes/${meal.recipeId}`);
  };

  const iconRecipe = meal.recipeId ? (
    <IconButton aria-label="Edit" style={style.iconBtn} onClick={viewRecipe}>
      <VisibilityIcon fontSize="medium" style={style.iconView} />
    </IconButton>
  ) : null;

  if (!authId) return <Navigate to="/signin" />;

  return (
    <Box sx={style.box}>
      <Typography component="h3" variant="h6" style={style.text}>
        {meal.label}
      </Typography>
      {iconRecipe}
      <IconButton
        aria-label="settings"
        onClick={handleOpenMenu}
        aria-haspopup="true"
        aria-controls="long-menu"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={openMenu}
        onClose={handleCloseMenu}
      >
        <MenuItem value="" onClick={handleEditMeal}>
          <ListItemText primary={"Edit"} />
          <ListItemIcon>
            <EditIcon style={{ color: "#0c62ff", marginLeft: ".8rem" }} />
          </ListItemIcon>
        </MenuItem>
        <MenuItem value="" onClick={handleRemoveMeal}>
          <ListItemText primary={"Remove"} />
          <ListItemIcon>
            <DeleteIcon style={{ color: "red", marginLeft: ".8rem" }} />
          </ListItemIcon>
        </MenuItem>
      </Menu>
      <MealDialog
        open={openDialog}
        setOpen={setOpenDialog}
        mealDate={meal.mealDate}
        mealType={meal.mealType}
        mealText={meal.label}
        mealId={meal.id}
        dialogType="update"
      />
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteMealAction: (mealId) => dispatch(deleteMealAction(mealId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MealItem);
