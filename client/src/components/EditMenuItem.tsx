import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
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
  const [isLoadingItem, setIsLoadingItem] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getMenuItem(Number(foodId))
      .then((item) =>
        setFood({
          name: item.name,
          category: item.category,
          halfPrice: item.halfPrice,
          fullPrice: item.fullPrice,
        })
      )
      .finally(() => setIsLoadingItem(false));
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

    setIsSubmitting(true);
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
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || isLoadingItem;

  return (
    <Box sx={{ maxWidth: 480 }}>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Update this dish's details.
      </Typography>
      <Divider sx={{ mb: 4 }} />

      {isLoadingItem ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Skeleton height={56} />
          <Skeleton height={56} />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Skeleton height={56} sx={{ flex: 1 }} />
            <Skeleton height={56} sx={{ flex: 1 }} />
          </Box>
        </Box>
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            required
            fullWidth
            label="Food Name"
            name="name"
            value={food.name || ""}
            disabled={isDisabled}
            onChange={handleChange}
          />
          <TextField
            required
            fullWidth
            label="Category"
            name="category"
            value={food.category || ""}
            disabled={isDisabled}
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
              disabled={isDisabled}
              onChange={handleChange}
            />
            <TextField
              type="number"
              required
              fullWidth
              label="Full Price"
              name="fullPrice"
              value={food.fullPrice || ""}
              disabled={isDisabled}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", mt: 1 }}>
            <Button
              variant="text"
              onClick={() => navigate("/menu")}
              disabled={isDisabled}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isDisabled}
              endIcon={
                isSubmitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SaveRoundedIcon />
                )
              }
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EditMenuItem;
