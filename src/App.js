import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import CategoryPage from './components/categories/CategoryPage';
import ProjectDetails from './components/projects/ProjectDetails';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import CreateProject from './components/projects/CreateProject';
import MainLayout from './components/layout/MainLayout';

import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
}));


function App() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const toggleDrawer = event => setOpen(!open);

  return (
    <BrowserRouter>

      {/* <Navbar /> */}
      <Routes>
        <Route exact path='/' element={
          <MainLayout children={<Dashboard />} />
        } />
        <Route path='/categories' element={
          <MainLayout children={<CategoryPage />} />
        } />
        <Route path='/project/:id' element={
          <MainLayout children={<ProjectDetails />} />
        } />
        <Route path='/signin' element={
          <MainLayout children={<SignIn />} />
        } />
        <Route path='/signup' element={
          <MainLayout children={<SignUp />} />
        } />
        <Route path='/create' element={
          <MainLayout children={<CreateProject />} />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
