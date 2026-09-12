import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { toast } from "react-toastify";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFood((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);
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
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 520 }}>
      <Typography variant="h5" fontWeight={800} gutterBottom>
        Add Menu Item
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add a new dish to the menu.
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField
              required
              fullWidth
              label="Food Name"
              name="name"
              value={food.name}
              onChange={handleChange}
            />
            <TextField
              required
              fullWidth
              label="Category"
              name="category"
              value={food.category}
              onChange={handleChange}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                type="number"
                required
                fullWidth
                label="Half Price"
                name="halfPrice"
                value={food.halfPrice}
                onChange={handleChange}
              />
              <TextField
                type="number"
                required
                fullWidth
                label="Full Price"
                name="fullPrice"
                value={food.fullPrice}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", mt: 1 }}>
              <Button
                variant="text"
                onClick={() => navigate("/menu")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                endIcon={
                  isSubmitting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <SaveRoundedIcon />
                  )
                }
              >
                {isSubmitting ? "Adding..." : "Add Item"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddMenuItem;
