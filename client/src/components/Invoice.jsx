import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import PostAddTwoToneIcon from "@mui/icons-material/PostAddTwoTone";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import "./styles/Invoice.css";
import Navbar from "./Navbar";
import BottomNavigation from "@mui/material/BottomNavigation";
import { useCatalog } from "../context/CatalogContext";
import { useBillDraft } from "../context/BillContext";
import { createBill } from "../api/bills";

const PAYMENT_MODES = ["CASH", "DEBIT_CARD", "CREDIT_CARD", "UPI", "OTHER"];

const Invoice = () => {
  const navigate = useNavigate();
  const { menuItems } = useCatalog();
  const { draftLines, addOrUpdateLine, removeLine, clearDraft, setLastBill } =
    useBillDraft();

  const [foodName, setFoodName] = useState("");
  const [quantityType, setQuantityType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [discount, setDiscount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  const handleAdd = () => {
    if (!foodName || !quantityType || !quantity) {
      toast.error("Enter All Fields!");
      return;
    }

    const menuItem = menuItems.find((item) => item.name === foodName);
    if (!menuItem) return;

    const unitPrice = Number(
      quantityType === "HALF" ? menuItem.halfPrice : menuItem.fullPrice
    );
    const parsedQuantity = parseInt(quantity, 10);

    addOrUpdateLine({
      menuItemId: menuItem.id,
      foodName: menuItem.name,
      quantityType,
      quantity: parsedQuantity,
      unitPrice,
      amount: unitPrice * parsedQuantity,
    });

    toast.success(`${menuItem.name} added!`);
    setFoodName("");
    setQuantityType("");
    setQuantity("");
  };

  const handleFinish = async () => {
    if (!discount || !paymentMode) {
      toast.error("Enter All Fields!");
      return;
    }
    if (draftLines.length === 0) {
      toast.error("Add at least one item!");
      return;
    }
    if (!window.confirm("Create Invoice? Check DISCOUNT again!!!")) {
      return;
    }

    try {
      const bill = await createBill({
        paymentMode,
        discountPercent: Number(discount),
        lines: draftLines.map((line) => ({
          menuItemId: line.menuItemId,
          quantityType: line.quantityType,
          quantity: line.quantity,
        })),
      });

      setLastBill(bill);
      toast.success("Generating Bill...");
      clearDraft();
      navigate("/printInvoice");
    } catch (error) {
      toast.error(error.response?.data?.error ?? "Failed to create invoice");
    }
  };

  return (
    <div>
      <div className="navbar">
        <Navbar showText="INVOICE & PREVIEW" />
      </div>
      <div className="flex-container">
        <div className="flex-child">
          <div>
            <Box
              component="form"
              sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
              noValidate
              autoComplete="off"
            >
              <div className="invoice-r2">
                <TextField
                  error={Number(discount) < 0}
                  helperText={Number(discount) < 0 && "(-) Negative Input"}
                  id="outlined-discount"
                  name="discount"
                  label="Discount"
                  value={discount}
                  type="number"
                  onChange={(e) => setDiscount(e.target.value)}
                />
                <TextField
                  id="outlined-select-payment-mode"
                  select
                  name="payment_mode"
                  label="Payment Mode"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  {PAYMENT_MODES.map((mode) => (
                    <MenuItem key={mode} value={mode}>
                      {mode.replace("_", " ")}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <br></br>
              <div className="invoice-r3">
                <TextField
                  id="outlined-select-food"
                  select
                  name="food_name"
                  label="Item"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                >
                  {menuItems.map((item) => (
                    <MenuItem key={item.name} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <br></br>
              <div className="invoice-r4">
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                    value={quantityType}
                    onChange={(e) => setQuantityType(e.target.value)}
                  >
                    <FormControlLabel value="FULL" control={<Radio />} label="Full" />
                    <FormControlLabel value="HALF" control={<Radio />} label="Half" />
                    <FormControlLabel
                      value="NA"
                      control={<Radio />}
                      label="Not Applicable"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <br></br>
              <div className="invoice-r5">
                <TextField
                  error={Number(quantity) < 0}
                  helperText={Number(quantity) < 0 && "(-) Negative Input"}
                  id="outlined-select-quantity"
                  name="quantity"
                  label="Quantity"
                  value={quantity}
                  type="number"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <br></br>
              <div className="invoice-r6">
                <Button
                  className="add"
                  variant="contained"
                  color="success"
                  onClick={handleAdd}
                  endIcon={<PostAddTwoToneIcon />}
                >
                  ADD / UPDATE
                </Button>
              </div>
              <br></br>
              <div className="invoice-r7">
                <Button
                  className="fin"
                  variant="outlined"
                  color="primary"
                  onClick={handleFinish}
                  endIcon={<CheckCircleOutlineTwoToneIcon />}
                >
                  FINISH
                </Button>
              </div>
            </Box>
          </div>
        </div>

        <div className="flex-child">
          <div></div>
          <div>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 440 }} className="invoice-ppr">
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" className="invoiceTb">
                        No.
                      </TableCell>
                      <TableCell align="center" className="invoiceTb">
                        Item
                      </TableCell>
                      <TableCell align="center" className="invoiceTb">
                        Qty
                      </TableCell>
                      <TableCell align="center" className="invoiceTb">
                        Rate
                      </TableCell>
                      <TableCell align="center" className="invoiceTb">
                        Price
                      </TableCell>
                      <TableCell align="center" className="deleteCell"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {draftLines.map((line, i) => (
                      <TableRow
                        key={i}
                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell component="th" scope="row" className="first-col-invoice">
                          {i + 1}
                        </TableCell>
                        <TableCell align="center">
                          {line.quantityType === "HALF"
                            ? `${line.foodName}(H)`
                            : `${line.foodName}(F)`}
                        </TableCell>
                        <TableCell align="center">{line.quantity}</TableCell>
                        <TableCell align="center">{line.unitPrice}</TableCell>
                        <TableCell align="center">{line.amount}</TableCell>
                        <TableCell align="center" className="deleteColumn">
                          <Button
                            color="inherit"
                            size="small"
                            onClick={() => removeLine(i)}
                            endIcon={<DeleteIcon />}
                          ></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
        </div>
      </div>
      <div>
        <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation sx={{ backgroundColor: "primary.main" }} />
        </Paper>
      </div>
    </div>
  );
};

export default Invoice;
