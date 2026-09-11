import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import "./styles/AddEditMenuItem.css";
import Navbar from "./Navbar";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import { getMenuItem, updateMenuItem } from "../api/menu";
import { useCatalog } from "../context/CatalogContext";

const EditMenuItem = () => {
  const navigate = useNavigate();
  const { refreshMenu } = useCatalog();
  const { food_id: foodId } = useParams();

  const [food, setFood] = useState({
    name: "",
    category: "",
    halfPrice: "",
    fullPrice: "",
  });

  useEffect(() => {
    getMenuItem(Number(foodId)).then((item) =>
      setFood({
        name: item.name,
        category: item.category,
        halfPrice: item.halfPrice,
        fullPrice: item.fullPrice,
      })
    );
  }, [foodId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFood((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!food.name || !food.category || !food.halfPrice || !food.fullPrice) {
      toast.error("Enter All Fields!");
      return;
    }

    try {
      await updateMenuItem(Number(foodId), {
        name: food.name,
        category: food.category,
        halfPrice: Number(food.halfPrice),
        fullPrice: Number(food.fullPrice),
      });
      toast.success("Successfully Updated!");
      await refreshMenu();
      navigate("/menu");
    } catch (error) {
      toast.error(error.response?.data?.error ?? "Failed to update item");
    }
  };

  return (
    <div>
      <div className="navbar">
        <Navbar showText="EDIT ITEM" />
      </div>
      <div className="below-navbar">
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              required
              id="outlined-required"
              label="Food Name"
              name="name"
              value={food.name || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <TextField
              required
              id="outlined-required"
              label="Category"
              name="category"
              value={food.category || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <TextField
              type="number"
              required
              id="outlined-required"
              label="Half Price"
              name="halfPrice"
              value={food.halfPrice || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <TextField
              type="number"
              required
              id="outlined-required"
              label="Full Price"
              name="fullPrice"
              value={food.fullPrice || ""}
              onChange={handleChange}
            />
          </div>
          <Button
            className="addEditItem-btm"
            color="success"
            variant="contained"
            size="large"
            onClick={handleSubmit}
          >
            UPDATE ITEM
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

export default EditMenuItem;
