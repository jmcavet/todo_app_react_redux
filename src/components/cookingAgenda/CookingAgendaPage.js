import React, { useEffect } from "react";
import Toolbar from "@material-ui/core/Toolbar";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Navigate } from "react-router-dom";
import CookingGrid from "./CookingGrid";
import { getDay, dateToTimestamp } from "../../helper/date";
import { deleteMealAction } from "../../store/actions/mealActions";
import { definePageTitle } from "../../store/actions/settingsActions";

const CookingAgendaPage = ({
  auth,
  meals,
  deleteMealAction,
  definePageTitle,
}) => {
  const authId = auth.uid;

  useEffect(() => {
    definePageTitle({
      pageTitle: "Meal Planner",
    });
  }, []);

  useEffect(() => {
    if (authId && meals) {
      // Get timestamp for the day
      const todayTimestamp = dateToTimestamp(getDay(new Date()));

      // Get only documents belonging to the user
      const myMeals = meals.filter((meal) => meal.authorId === authId);

      // Get the past dates (those before today: they cannot be displayed anymore on the UI)
      const myPastMeals = myMeals.filter((meal) => {
        const mealDateToTimestamp = dateToTimestamp(meal.mealDate);
        return mealDateToTimestamp < todayTimestamp;
      });
      if (myPastMeals.length > 0) {
        // Remove each of those past meals, one by one
        myPastMeals.forEach((meal) => deleteMealAction(meal.id));
      }
    }
  }, [authId, meals, deleteMealAction]);

  if (!authId) return <Navigate to="/signin" />;

  return (
    <div className="container">
      <Toolbar />
      <div className="row" style={{ marginTop: "1rem" }}>
        <CookingGrid />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    meals: state.firestore.ordered.meals,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteMealAction: (mealId) => dispatch(deleteMealAction(mealId)),
    definePageTitle: (title) => dispatch(definePageTitle(title)),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([{ collection: "meals", orderBy: ["createdAt", "desc"] }])
)(CookingAgendaPage);
