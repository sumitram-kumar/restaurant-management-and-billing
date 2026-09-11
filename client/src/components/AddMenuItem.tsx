import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import "./styles/AddEditMenuItem.css";
import Navbar from "./Navbar";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import { useCatalog } from "../context/CatalogContext";
import { createMenuItem } from "../api/menu";
import { getErrorMessage } from "../api/errorMessage";

const AddMenuItem = () => {
  const navigate = useNavigate();
  const { menuItems, refreshMenu } = useCatalog();

  const [food, setFood] = useState({
    name: "",
    category: "",
    halfPrice: "",
    fullPrice: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFood((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!food.name || !food.category || !food.halfPrice || !food.fullPrice) {
      toast.error("Enter All Fields!");
      return;
    }

    const alreadyExists = menuItems.some(
      (item) => item.name.toLowerCase() === food.name.toLowerCase()
    );
    if (alreadyExists) {
      toast.error("Item Already Exists!");
      return;
    }

    try {
      await createMenuItem({
        name: food.name,
        category: food.category,
        halfPrice: Number(food.halfPrice),
        fullPrice: Number(food.fullPrice),
      });
      toast.success("Successfully Added!");
      await refreshMenu();
      navigate("/menu");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to add item"));
    }
  };

  return (
    <div>
      <div className="navbar">
        <Navbar showText="ADD ITEM" />
      </div>
      <div className="below-navbar">
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
        >
          <div className="addmenutab">
            <TextField
              required
              id="outlined-required"
              label="Food Name"
              name="name"
              onChange={handleChange}
            />
          </div>
          <div className="addmenutab">
            <TextField
              required
              id="outlined-required"
              label="Category"
              name="category"
              onChange={handleChange}
            />
          </div>
          <div className="addmenutab">
            <TextField
              type="number"
              required
              id="outlined-required"
              label="Half Price"
              name="halfPrice"
              onChange={handleChange}
            />
          </div>
          <div className="addmenutab">
            <TextField
              type="number"
              required
              id="outlined-required"
              label="Full Price"
              name="fullPrice"
              onChange={handleChange}
            />
          </div>
          <Button
            color="success"
            variant="contained"
            size="large"
            className="addEditItem-btm"
            onClick={handleSubmit}
          >
            ADD ITEM
          </Button>
        </Box>
      </div>
      <div>
        <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation sx={{ backgroundColor: "primary.main" }} />
        </Paper>
      </div>
    </div>
  );
};

export default AddMenuItem;
