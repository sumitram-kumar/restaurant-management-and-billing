import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { toast } from "react-toastify";
import { getMenuItem, updateMenuItem } from "../api/menu";
import { useCatalog } from "../context/CatalogContext";
import { getErrorMessage } from "../api/errorMessage";

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
      toast.error(getErrorMessage(error, "Failed to update item"));
    }
  };

  return (
    <Box sx={{ maxWidth: 520 }}>
      <Typography variant="h5" fontWeight={800} gutterBottom>
        Edit Menu Item
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Update this dish's details.
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
              value={food.name || ""}
              onChange={handleChange}
            />
            <TextField
              required
              fullWidth
              label="Category"
              name="category"
              value={food.category || ""}
              onChange={handleChange}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                type="number"
                required
                fullWidth
                label="Half Price"
                name="halfPrice"
                value={food.halfPrice || ""}
                onChange={handleChange}
              />
              <TextField
                type="number"
                required
                fullWidth
                label="Full Price"
                name="fullPrice"
                value={food.fullPrice || ""}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", mt: 1 }}>
              <Button variant="text" onClick={() => navigate("/menu")}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" endIcon={<SaveRoundedIcon />}>
                Save Changes
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditMenuItem;
