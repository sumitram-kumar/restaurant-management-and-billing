import React, { useState } from "react";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./styles/UpdateTax.css";
import Navbar from "./Navbar";
import BottomNavigation from "@mui/material/BottomNavigation";
import Paper from "@mui/material/Paper";
import { useCatalog } from "../context/CatalogContext";
import { createTaxRate } from "../api/tax";
import { getErrorMessage } from "../api/errorMessage";

const UpdateTax = () => {
  const { taxRate, refreshTaxRate } = useCatalog();
  const [draft, setDraft] = useState({ cgst: "", sgst: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDraft((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!draft.cgst || !draft.sgst) {
      toast.error("Enter All Fields!");
      return;
    }

    try {
      await createTaxRate({ cgst: Number(draft.cgst), sgst: Number(draft.sgst) });
      toast.success("Taxes Updated!");
      await refreshTaxRate();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update tax rate"));
    }
  };

  const cgst = draft.cgst !== "" ? draft.cgst : taxRate.cgst;
  const sgst = draft.sgst !== "" ? draft.sgst : taxRate.sgst;

  return (
    <div>
      <div className="navbar">
        <Navbar showText="UPDATE TAX" />
      </div>
      <div className="below-navbar">
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
        >
          <div className="tax-text">
            <TextField
              className="tax"
              error={Number(cgst) < 0}
              helperText={Number(cgst) < 0 && "(-) Negative Input"}
              id="outlined-required"
              label="CGST"
              type="number"
              name="cgst"
              onChange={handleChange}
              value={cgst}
            />
          </div>
          <div className="tax-text">
            <TextField
              className="tax"
              error={Number(sgst) < 0}
              helperText={Number(sgst) < 0 && "(-) Negative Input"}
              id="outlined-required"
              label="SGST"
              type="number"
              name="sgst"
              onChange={handleChange}
              value={sgst}
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <br></br>
          <Button
            className="tax-btn"
            variant="contained"
            onClick={handleSubmit}
            color="success"
            size="large"
          >
            UPDATE TAXES
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

export default UpdateTax;
