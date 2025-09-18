import React, { useEffect, useState } from "react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";

import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";

import { Grid, Box, Button, Toolbar, Typography } from "@mui/material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { makeStyles } from "@material-ui/styles";

import Todos from "../todos/Todos";
import CreateItemAccordion from "./CreateItemAccordion";
import FilterButton from "./FilterButton";
import ModalFilter from "./ModalFilter";
import LoadingLinearProgress from "../layout/LoadingLinearProgress";
import { filterCategories } from "../../store/actions/filterActions";
import { definePageTitle } from "../../store/actions/settingsActions";
import DialogTodoEdit from "../todos/DialogTodoEdit";

const useStyles = makeStyles((theme) => ({
  btnTest: {
    background: "red",
    color: "yellow",
  },
}));

const DashboardPage = ({
  auth,
  todos,
  tags,
  categories,
  stateFilter,
  filterCategories,
  definePageTitle,
}) => {
  useEffect(() => {
    definePageTitle({
      pageTitle: "Dashboard",
    });
  }, [definePageTitle]);

  const authId = auth.uid;
  const navigate = useNavigate();
  const [modalFilterOpen, setModalFilterOpen] = useState(false);
  const [openTodoDialog, setOpenTodoDialog] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    console.log("modalFilterOpen updated: ", modalFilterOpen);
  }, [modalFilterOpen]);

  const animationStyles = useSpring({
    from: { opacity: "0.4", color: "blue" },
    to: [
      { opacity: "1", color: "blue", background: "yellow" },
      { opacity: "0.4", color: "blue" },
    ],
    config: { duration: "500" },
    loop: true,
  });

  // Initialize todos, tags & categories belonging to the user
  const [myTodos, setMyTodos] = useState(null);
  const [myTags, setMyTags] = useState(null);
  const [myCategories, setMyCategories] = useState(null);

  const getCategoriesFilteredIds = (todos, tags, categories) => {
    const uniqueTagIds = [...new Set(todos?.map((todo) => todo.tagId))];
    const todosTags = tags?.filter((tag) => uniqueTagIds.includes(tag.id));
    const todosCategoryIds = todosTags?.map((todosTag) => todosTag.categoryId);
    const uniqueCategoryIds = [...new Set(todosCategoryIds)];
    const categoriesFiltered = categories?.filter((category) =>
      uniqueCategoryIds.includes(category.id)
    );
    const dict_categoryIdsFiltered = {};
    categoriesFiltered?.forEach((category) => {
      dict_categoryIdsFiltered[category.id] = true;
    });

    return dict_categoryIdsFiltered;
  };

  useEffect(() => {
    if (authId && todos && tags && categories) {
      // Get only documents belonging to the user
      const todosFiltered = todos.filter((todo) => todo.authorId === authId);
      const tagsFiltered = tags.filter((tag) => tag.authorId === authId);
      const categoriesFiltered = categories.filter(
        (category) => category.authorId === authId
      );

      const dict_categoryIdsFiltered = getCategoriesFilteredIds(
        todosFiltered,
        tagsFiltered,
        categoriesFiltered
      );
      filterCategories(dict_categoryIdsFiltered);

      setMyTodos(todosFiltered);
      setMyTags(tagsFiltered);
      setMyCategories(categoriesFiltered);
    }
  }, [authId, todos, tags, categories]);

  if (!authId) return <Navigate to="/signin" />;

  if (!myTodos || !myTags || !myCategories) return <LoadingLinearProgress />;

  if (myTags.length === 0 && myCategories.length === 0) {
    return (
      <div className="dashboard container">
        <Toolbar />
        <div className="row">
          <Typography component="h1" variant="h3">
            Welcome on Familiapp
          </Typography>
          <Typography component="h2" variant="h4">
            Begin by creating a new category and a related tag
          </Typography>
          <h5>
            Navigate to the
            <animated.span className="test" style={animationStyles}>
              <NavLink to="/categories"> Categories </NavLink>
            </animated.span>{" "}
            page!
          </h5>
        </div>
      </div>
    );
  }

  const goToCart = () => navigate("/cart");

  if (stateFilter.categories) {
    return (
      <div className="dashboard container">
        <Toolbar />
        <div className="row">
          <Grid xs={12} item style={{ marginTop: "1rem" }}>
            <Box style={{ display: "flex", justifyContent: "space-between" }}>
              <FilterButton setModalFilterOpen={setModalFilterOpen} />
              <Button
                variant="contained"
                color="secondary"
                startIcon={<ArrowCircleRightIcon fontSize="large" />}
                onClick={goToCart}
                className={classes.btnTest}
              >
                Define your cart
              </Button>
            </Box>
          </Grid>

          <Box sx={{ display: "flex", borderRadius: 1, alignItems: "center" }}>
            <Box sx={{ flexGrow: 1 }}>
              <CreateItemAccordion />
            </Box>
          </Box>
          <ModalFilter
            setModalFilterOpen={setModalFilterOpen}
            modalFilterOpen={modalFilterOpen}
          />
          <Todos todos={myTodos} setOpenTodoDialog={setOpenTodoDialog} />
        </div>
        <DialogTodoEdit
          openTodoDialog={openTodoDialog}
          setOpenTodoDialog={setOpenTodoDialog}
        />
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    todos: state.firestore.ordered.todos,
    tags: state.firestore.ordered.tags,
    categories: state.firestore.ordered.categories,
    stateFilter: state.filter,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    filterCategories: (payload) => dispatch(filterCategories(payload)),
    definePageTitle: (title) => dispatch(definePageTitle(title)),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: "todos", orderBy: ["createdAt", "desc"] },
    { collection: "tags", orderBy: ["createdAt", "desc"] },
    { collection: "categories", orderBy: ["createdAt", "desc"] },
    { collection: "favorites", orderBy: ["createdAt", "desc"] },
  ])
)(DashboardPage);
