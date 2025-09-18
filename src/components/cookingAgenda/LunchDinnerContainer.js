import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { Paper, Box, Typography, IconButton } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MealItem from "./MealItem";
import MealDialog from "./MealDialog";
import RecipesDialog from "./RecipesDialog";

const style = {
  paper: {
    background: "#0a1b79",
    color: "#fff",
    textAlign: "center",
    width: "95%",
    margin: ".5rem auto 1rem",
  },
  mealType: {
    margin: 0,
    padding: 0,
    fontWeight: 600,
  },
  iconAddMeal: { color: "white" },
};

const LunchDinnerContainer = ({ mealDate, mealType, auth, meals }) => {
  const [myMealsPerDate, setMyMealsPerDate] = useState([]);
  const [openMealDialog, setOpenMealDialog] = useState(false);
  const [openRecipesDialog, setOpenRecipesDialog] = useState(false);

  const authId = auth.uid;

  useEffect(() => {
    if (authId && meals) {
      // Get only documents belonging to the user
      const myMeals = meals.filter((meal) => meal.authorId === authId);

      const mealsFiltered = myMeals?.filter(
        (myMeal) => myMeal.mealDate === mealDate && myMeal.mealType === mealType
      );

      // Sort out meals according to the date when it was created
      mealsFiltered.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

      if (mealsFiltered) setMyMealsPerDate(mealsFiltered);
    }
  }, [authId, meals, mealDate, mealType]);

  const handleOpenMealDialog = () => setOpenMealDialog(true);
  const handleOpenRecipesDialog = () => setOpenRecipesDialog(true);

  if (!auth.uid) return <Navigate to="/signin" />;

  return (
    <Paper elevation={3} style={style.paper}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginLeft: "1rem",
        }}
      >
        <Typography component="h3" variant="h6" style={style.mealType}>
          {mealType}
        </Typography>
        <IconButton
          aria-label="add-recipe-meal"
          onClick={handleOpenRecipesDialog}
          style={{ marginLeft: "auto" }}
        >
          <RestaurantIcon style={style.iconAddMeal} />
        </IconButton>
        <IconButton
          aria-label="add-userdefined-meal"
          onClick={handleOpenMealDialog}
        >
          <AddCircleOutlineIcon style={style.iconAddMeal} />
        </IconButton>
      </Box>
      {myMealsPerDate.map((myMeal) => {
        return <MealItem meal={myMeal} key={myMeal.id} />;
      })}
      <MealDialog
        open={openMealDialog}
        setOpen={setOpenMealDialog}
        mealDate={mealDate}
        mealType={mealType}
        mealText={null}
        mealId={null}
        dialogType="apply"
      />
      <RecipesDialog
        open={openRecipesDialog}
        setOpen={setOpenRecipesDialog}
        mealDate={mealDate}
        mealType={mealType}
        dialogType="apply"
      />
    </Paper>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    meals: state.firestore.ordered.meals,
  };
};

export default connect(mapStateToProps, null)(LunchDinnerContainer);
