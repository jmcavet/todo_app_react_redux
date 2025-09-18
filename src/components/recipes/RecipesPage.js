import React, { useEffect, useState } from "react";
import Toolbar from "@material-ui/core/Toolbar";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Navigate } from "react-router-dom";

import { Grid, Box, Button, InputBase, IconButton, Badge } from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import RecipeForm from "./RecipeForm";
import Recipes from "./Recipes";
import FilterButton from "../dashboard/FilterButton";
import ModalRecipeFilter from "./ModalRecipeFilter";
import { definePageTitle } from "../../store/actions/settingsActions";

import { areEqual } from "../../helper/utils";

const style = {
  box: {
    display: "flex",
    marginTop: "1rem",
    justifyContent: "space-between",
  },
};

const RecipesPage = ({ auth, recipes, recipeTagReducer, definePageTitle }) => {
  const authId = auth.uid;

  const [btnNewRecipe, setBtnNewRecipe] = useState("New Recipe");
  const [iconBtn, setIconBtn] = useState(
    <AddCircleOutlineIcon fontSize="large" />
  );
  const [openRecipeForm, setOpenRecipeForm] = useState(false);
  const [modalFilterOpen, setModalFilterOpen] = useState(false);
  const [countFilters, setCountFilters] = useState(null);
  const [searchRecipe, setSearchRecipe] = useState("");
  const [recipesSearch, setRecipesSearch] = useState(null);

  useEffect(() => {
    definePageTitle({
      pageTitle: "Recipes",
    });
  }, []);

  useEffect(() => {
    if (recipeTagReducer.filtered) {
      // Convert the object 'recipeTagReducer.filtered' to a key/value array
      const recipeTagsObjectAsArray = Object.entries(recipeTagReducer.filtered);

      // Filter to get only those 'active'
      const recipeTagIdsActiveTest = recipeTagsObjectAsArray.filter(
        ([_, value]) => value === "active"
      );
      const recipeTagIdsActive = Object.keys(
        Object.fromEntries(recipeTagIdsActiveTest)
      );

      // If no filter used, do not provide any number to the Badge component
      if (recipeTagIdsActive.length === recipeTagsObjectAsArray.length)
        setCountFilters(null);
      else setCountFilters(recipeTagIdsActive.length);
    }
  }, [recipeTagReducer.filtered]);

  const getMyRecipesFiltered = () => {
    const recipeTagsObjectAsArray = Object.entries(recipeTagReducer.filtered);

    // Filter to get only those 'active'
    const recipeTagIdsActiveTest = recipeTagsObjectAsArray.filter(
      ([_, value]) => value === "active"
    );
    const recipeTagIdsActive = Object.keys(
      Object.fromEntries(recipeTagIdsActiveTest)
    );

    // Get only documents belonging to the user
    const myRecipes = recipes?.filter((recipe) => recipe.authorId === authId);

    // Get the array of recipes having those active tags
    const myRecipesFiltered = myRecipes?.filter((recipe) => {
      const recipeTags = recipe.tags;
      const intersection = recipeTags.filter((x) =>
        recipeTagIdsActive.includes(x)
      );
      const arraysAreEqual = areEqual(intersection, recipeTagIdsActive);
      return arraysAreEqual;
    });

    return myRecipesFiltered;
  };

  useEffect(() => {
    if (recipeTagReducer.filtered.length > 0) {
      const myRecipesFiltered = getMyRecipesFiltered();
      setRecipesSearch(myRecipesFiltered);
    } else {
      // Get only documents belonging to the user
      const myRecipes = recipes?.filter((recipe) => recipe.authorId === authId);
      setRecipesSearch(myRecipes);
    }
  }, []);

  const handleChangeSearch = (e) => {
    const search = e.target.value;
    setSearchRecipe(search);

    const myRecipesFiltered = getMyRecipesFiltered();

    if (search.length > 2) {
      const myRecipesFilteredBySearch = myRecipesFiltered.filter((obj) => {
        return obj.title.toLowerCase().includes(search.toLowerCase());
      });
      setRecipesSearch(myRecipesFilteredBySearch);
    } else {
      setRecipesSearch(myRecipesFiltered);
    }
  };

  const removeSearch = () => {
    setSearchRecipe("");

    const myRecipesFiltered = getMyRecipesFiltered();

    setRecipesSearch(myRecipesFiltered);
  };

  const handleOpenRecipeForm = () => {
    if (!openRecipeForm) {
      setBtnNewRecipe("Hide form");
      setIconBtn(<VisibilityOffIcon fontSize="large" />);
    } else {
      setBtnNewRecipe("New Recipe");
      setIconBtn(<AddCircleOutlineIcon fontSize="large" />);
    }

    setOpenRecipeForm(!openRecipeForm);
  };

  if (!authId) return <Navigate to="/signin" />;

  return (
    <div className="container">
      <Toolbar />
      <div className="row">
        <Box style={style.box}>
          <Badge color="primary" badgeContent={countFilters}>
            <FilterButton
              modalFilterOpen={modalFilterOpen}
              setModalFilterOpen={setModalFilterOpen}
            />
          </Badge>
          <Button
            variant="contained"
            color="secondary"
            endIcon={iconBtn}
            onClick={handleOpenRecipeForm}
          >
            {btnNewRecipe}
          </Button>
        </Box>
      </div>
      <div className="row">
        <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
          <Grid item xs={1} sm={1} md={1}>
            <IconButton sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Grid>
          <Grid item xs={10} sm={10} md={10}>
            <InputBase
              placeholder="Search recipe..."
              inputProps={{ "aria-label": "search recipe" }}
              value={searchRecipe}
              autoComplete="off"
              fullWidth
              onChange={handleChangeSearch}
            />
          </Grid>
          <Grid item xs={1} sm={1} md={1}>
            <IconButton
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
              onClick={removeSearch}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </div>
      <RecipeForm openRecipeForm={openRecipeForm} btnType="add" />
      <Recipes recipesSearch={recipesSearch} />
      <ModalRecipeFilter
        setModalFilterOpen={setModalFilterOpen}
        modalFilterOpen={modalFilterOpen}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    recipes: state.firestore.ordered.recipes,
    recipeTagReducer: state.recipeTagReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    definePageTitle: (title) => dispatch(definePageTitle(title)),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([{ collection: "recipes", orderBy: ["createdAt", "desc"] }])
)(RecipesPage);
