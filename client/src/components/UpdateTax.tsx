import React, { useState } from "react";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { useCatalog } from "../context/CatalogContext";
import { createTaxRate } from "../api/tax";
import { getErrorMessage } from "../api/errorMessage";

const UpdateTax = () => {
  const { taxRate, refreshTaxRate } = useCatalog();
  const [draft, setDraft] = useState({ cgst: "", sgst: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDraft((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.cgst || !draft.sgst) {
      toast.error("Enter All Fields!");
      return;
    }

    setIsSubmitting(true);
    try {
      await createTaxRate({ cgst: Number(draft.cgst), sgst: Number(draft.sgst) });
      toast.success("Taxes Updated!");
      setDraft({ cgst: "", sgst: "" });
      await refreshTaxRate();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update tax rate"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const cgst = draft.cgst !== "" ? draft.cgst : "";
  const sgst = draft.sgst !== "" ? draft.sgst : "";

  return (
    <Box sx={{ maxWidth: 520 }}>
      <Typography variant="h5" fontWeight={800} gutterBottom>
        Tax Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Set the CGST / SGST rate applied to new invoices.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-around",
            textAlign: "center",
          }}
        >
          <Box>
            <Typography variant="overline" color="text.secondary">
              Current CGST
            </Typography>
            <Typography variant="h4" fontWeight={800}>
              {taxRate.cgst}%
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box>
            <Typography variant="overline" color="text.secondary">
              Current SGST
            </Typography>
            <Typography variant="h4" fontWeight={800}>
              {taxRate.sgst}%
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                error={Number(cgst) < 0}
                helperText={Number(cgst) < 0 ? "(-) Negative Input" : " "}
                label="New CGST %"
                type="number"
                name="cgst"
                fullWidth
                onChange={handleChange}
                value={cgst}
              />
              <TextField
                error={Number(sgst) < 0}
                helperText={Number(sgst) < 0 ? "(-) Negative Input" : " "}
                label="New SGST %"
                type="number"
                name="sgst"
                fullWidth
                onChange={handleChange}
                value={sgst}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
                {isSubmitting ? "Updating..." : "Update Taxes"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UpdateTax;
