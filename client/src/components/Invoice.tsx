import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
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
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useCatalog } from "../context/CatalogContext";
import { useBillDraft } from "../context/BillContext";
import { createBill } from "../api/bills";
import { getErrorMessage } from "../api/errorMessage";
import { PaymentMode, QuantityType } from "../types";

const PAYMENT_MODES: PaymentMode[] = [
  "CASH",
  "DEBIT_CARD",
  "CREDIT_CARD",
  "UPI",
  "OTHER",
];

const Invoice = () => {
  const navigate = useNavigate();
  const { menuItems } = useCatalog();
  const { draftLines, addOrUpdateLine, removeLine, clearDraft, setLastBill } =
    useBillDraft();

  const [foodName, setFoodName] = useState("");
  const [quantityType, setQuantityType] = useState<QuantityType | "">("");
  const [quantity, setQuantity] = useState("");
  const [discount, setDiscount] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode | "">("");

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
      toast.error(getErrorMessage(error, "Failed to create invoice"));
    }
  };

  const subtotal = draftLines.reduce((sum, line) => sum + line.amount, 0);

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} gutterBottom>
        New Invoice
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add items to the order, then finish to save and print.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", md: "380px 1fr" },
          alignItems: "start",
        }}
      >
        <Card>
          <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Add Item
            </Typography>
            <TextField
              select
              label="Item"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              fullWidth
            >
              {menuItems.map((item) => (
                <MenuItem key={item.name} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>

            <FormControl>
              <FormLabel sx={{ fontSize: 13, mb: 0.5 }}>Portion</FormLabel>
              <RadioGroup
                row
                value={quantityType}
                onChange={(e) => setQuantityType(e.target.value as QuantityType)}
              >
                <FormControlLabel
                  value="FULL"
                  control={<Radio size="small" />}
                  label="Full"
                />
                <FormControlLabel
                  value="HALF"
                  control={<Radio size="small" />}
                  label="Half"
                />
                <FormControlLabel
                  value="NA"
                  control={<Radio size="small" />}
                  label="N/A"
                />
              </RadioGroup>
            </FormControl>

            <TextField
              error={Number(quantity) < 0}
              helperText={Number(quantity) < 0 ? "(-) Negative Input" : " "}
              label="Quantity"
              value={quantity}
              type="number"
              fullWidth
              onChange={(e) => setQuantity(e.target.value)}
            />

            <Button
              variant="contained"
              onClick={handleAdd}
              startIcon={<PostAddTwoToneIcon />}
            >
              Add to Order
            </Button>

            <Divider sx={{ my: 0.5 }} />

            <Typography variant="subtitle1" fontWeight={700}>
              Finish Invoice
            </Typography>
            <TextField
              error={Number(discount) < 0}
              helperText={Number(discount) < 0 ? "(-) Negative Input" : " "}
              label="Discount %"
              value={discount}
              type="number"
              fullWidth
              onChange={(e) => setDiscount(e.target.value)}
            />
            <TextField
              select
              label="Payment Mode"
              value={paymentMode}
              fullWidth
              onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
            >
              {PAYMENT_MODES.map((mode) => (
                <MenuItem key={mode} value={mode}>
                  {mode.replace("_", " ")}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="outlined"
              color="success"
              onClick={handleFinish}
              endIcon={<CheckCircleOutlineTwoToneIcon />}
            >
              Finish & Print
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer sx={{ maxHeight: "55vh" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Rate</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {draftLines.map((line, i) => (
                    <TableRow key={i} hover>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {`${line.foodName} (${line.quantityType === "HALF" ? "H" : "F"})`}
                      </TableCell>
                      <TableCell align="right">{line.quantity}</TableCell>
                      <TableCell align="right">{`₹${line.unitPrice}`}</TableCell>
                      <TableCell align="right">{`₹${line.amount}`}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeLine(i)}
                        >
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {draftLines.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">
                          No items added yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {draftLines.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                  p: 2,
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography color="text.secondary">Subtotal:</Typography>
                <Typography fontWeight={700}>{`₹${subtotal.toFixed(2)}`}</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Invoice;
