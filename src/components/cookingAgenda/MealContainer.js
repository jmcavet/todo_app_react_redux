import React from "react";
import { Grid, Typography } from "@mui/material";
import LunchDinnerContainer from "./LunchDinnerContainer";

const MealContainer = ({ meal }) => {
  const style = {
    gridContainer: {
      background: "#F3F3F3",
      color: "black",
      marginBottom: "2.5rem",
      borderRadius: "5px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.12)",
    },
    gridDateContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    date: { fontWeight: 600 },
  };

  return (
    <Grid container style={style.gridContainer}>
      <Grid item xs={12} sm={12} md={12} style={style.gridDateContainer}>
        <Typography component="h3" variant="h5" style={style.date}>
          {meal.date}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <LunchDinnerContainer mealDate={meal.date} mealType="Lunch" />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <LunchDinnerContainer mealDate={meal.date} mealType="Dinner" />
      </Grid>
    </Grid>
  );
};

export default MealContainer;
