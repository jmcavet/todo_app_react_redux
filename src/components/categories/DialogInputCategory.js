import React, { useState } from "react";
import { connect } from "react-redux";
import { RgbaColorPicker } from "react-colorful";

import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckIcon from "@mui/icons-material/Check";

import { reverseColor, rgbCode } from "../../helper/color";
import {
  createCategory,
  selectCategory,
} from "../../store/actions/categoryActions";

const DialogInputCategory = ({ createCategory, selectCategory }) => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({});
  const [category, setCategory] = useState("");
  const [color, setColor] = useState({ r: 10, g: 25, b: 135, a: 0.8 });

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    // Clear Dialog text field
    setCategory("");

    setOpen(false);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);

    setState((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
      color: color,
    }));
  };

  const onChangeColor = (c) => {
    setColor(c);

    setState((prevState) => ({
      ...prevState,
      color: c,
    }));
  };

  const handleApply = (e) => {
    createCategory(state);

    selectCategory(state);

    // Clear Dialog text field
    setCategory("");

    // Close dialog window
    setOpen(false);
  };

  const myStyle = {
    boxRgbaColorPicker: { marginTop: "2rem" },
    btnApply: { background: "#02951A" },
    paragraph: {
      background: rgbCode(color),
      color: reverseColor(color),
      fontSize: "1.3rem",
      padding: "1rem",
      textAlign: "center",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        mt: 2,
        justifyContent: "center",
      }}
    >
      <Button
        variant="contained"
        color="secondary"
        endIcon={<AddCircleOutlineIcon fontSize="large" />}
        onClick={handleClickOpen}
      >
        New Category
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a new category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="label"
            label="Category"
            type="text"
            fullWidth
            variant="standard"
            value={category}
            onChange={handleCategoryChange}
          />
          <Box
            display="flex"
            justifyContent="center"
            style={myStyle.boxRgbaColorPicker}
          >
            <RgbaColorPicker color={color} onChange={onChangeColor} />
          </Box>
          <p style={myStyle.paragraph}>{category}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            style={myStyle.btnApply}
            endIcon={<CheckIcon fontSize="large" />}
            onClick={handleApply}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    createCategory: (category) => dispatch(createCategory(category)),
    selectCategory: (category) => dispatch(selectCategory(category)),
  };
};

export default connect(null, mapDispatchToProps)(DialogInputCategory);
