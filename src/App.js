import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./components/dashboard/DashboardPage";
import CategoryPage from "./components/categories/CategoryPage";
import CartPage from "./components/cart/CartPage";
import RecipesPage from "./components/recipes/RecipesPage";
import CookingAgendaPage from "./components/cookingAgenda/CookingAgendaPage";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import MainLayout from "./components/layout/MainLayout";
import RecipeViewPage from "./components/recipes/RecipeViewPage";
import ContactPage from "./components/contact/ContactPage";

import { blue, pink, purple, yellow } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { teal } from "@material-ui/core/colors";

const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: blue[300],
      main: blue[500],
      dark: blue[700],
    },
    secondary: {
      main: "rgb(245, 97, 41)", // your orange
      light: "rgb(255, 140, 90)", // a lighter tint (optional)
      dark: "rgb(200, 70, 25)", // a darker shade (optional)
      contrastText: "#fff", // text on top of secondary
    },
    contrastText: "yellow",
  },
});

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline enableColorScheme />
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={<MainLayout children={<DashboardPage />} />}
          />
          <Route
            path="/categories"
            element={<MainLayout children={<CategoryPage />} />}
          />
          <Route
            path="/cart"
            element={<MainLayout children={<CartPage />} />}
          />
          <Route
            path="/recipes"
            element={<MainLayout children={<RecipesPage />} />}
          />
          <Route
            path="/recipes/:id"
            element={<MainLayout children={<RecipeViewPage />} />}
          />
          <Route
            path="/cookingAgenda"
            element={<MainLayout children={<CookingAgendaPage />} />}
          />
          <Route
            path="/contact"
            element={<MainLayout children={<ContactPage />} />}
          />
          <Route
            path="/signin"
            element={<MainLayout children={<SignIn />} />}
          />
          <Route
            path="/signup"
            element={<MainLayout children={<SignUp />} />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
