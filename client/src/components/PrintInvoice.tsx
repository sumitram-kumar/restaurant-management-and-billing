import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PrintIcon from "@mui/icons-material/Print";
import "./styles/PrintInvoice.css";
import { useBillDraft } from "../context/BillContext";

const ticketStyle = {
  fontSize: "7.6px",
  fontFamily: "Helvetica",
  // A printed receipt is always black-on-white paper, independent of the
  // app's light/dark mode — this keeps the on-screen preview looking like
  // the actual physical output rather than inheriting the current theme.
  color: "#000",
};

const PrintInvoice = () => {
  const navigate = useNavigate();
  const { lastBill } = useBillDraft();

  if (!lastBill) {
    // Nothing to print — this page was reached without going through
    // Invoice's Finish step (e.g. a refresh). Send them back.
    navigate("/invoice");
    return null;
  }

  const cgst = Number(lastBill.taxRate.cgst);
  const sgst = Number(lastBill.taxRate.sgst);

  return (
    <Box>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3 }}
        className="hidden-print"
      >
        Bill #{lastBill.billNumber} was saved. Print a copy below if needed.
      </Typography>

      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 2,
          p: 3,
          display: "inline-block",
        }}
      >
        <div style={ticketStyle}>
          <div className="ticket">
            <p className="centered">
              <strong>RESTAURANT BILLING</strong>
              <br></br>123 Main Street,<br></br>Your City, 000000
            </p>
            <div className="row-print">
              <div className="column-print">
                <p style={{ fontSize: "7px", textAlign: "left" }}>
                  Order#{lastBill.billNumber}
                </p>
              </div>
              <div className="column-print">
                <p style={{ fontSize: "7px", textAlign: "right" }}>
                  Date: {new Date(lastBill.billDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <table>
              <thead>
                <tr className="title">
                  <th className="description" align="left">
                    Item(s)
                  </th>
                  <th className="quantity">Qnty</th>
                  <th className="price">Rate ₹</th>
                  <th className="price" align="right">
                    Amt ₹
                  </th>
                </tr>
              </thead>
              <tbody>
                {lastBill.lineItems.map((line) => (
                  <tr key={line.id}>
                    <td className="description" align="left">
                      {line.quantityType === "HALF"
                        ? `${line.foodNameSnapshot}(H)`
                        : `${line.foodNameSnapshot}(F)`}
                    </td>
                    <td className="quantity">{line.quantity}</td>
                    <td className="price">{line.unitPrice}</td>
                    <td className="price" align="right">
                      {line.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <div className="row-print">
                <div className="column-print">
                  <p style={{ fontSize: "7.6px", marginLeft: "2px", textAlign: "left" }}>
                    Subtotal:
                  </p>
                </div>
                <div className="column-print">
                  <p style={{ fontSize: "7.6px", textAlign: "right" }}>
                    ₹ {lastBill.subtotal}
                  </p>
                </div>
              </div>
              {Number(lastBill.discountAmount) > 0 && (
                <div className="row-print">
                  <div className="column-print">
                    <p
                      style={{ fontSize: "7.6px", marginLeft: "2px", textAlign: "left" }}
                    >
                      (-) Discount:
                    </p>
                  </div>
                  <div className="column-print">
                    <p style={{ fontSize: "7.6px", textAlign: "right" }}>
                      ₹ {lastBill.discountAmount}
                    </p>
                  </div>
                </div>
              )}
              {(cgst > 0 || sgst > 0) && (
                <div className="row-print">
                  <div className="column-print">
                    <p
                      style={{ fontSize: "7.6px", marginLeft: "2px", textAlign: "left" }}
                    >
                      CGST@ {cgst}%
                    </p>
                    <p
                      style={{ fontSize: "7.6px", marginLeft: "2px", textAlign: "left" }}
                    >
                      SGST@ {sgst}%
                    </p>
                  </div>
                  <div className="column-print">
                    <p style={{ fontSize: "7.6px", textAlign: "right" }}>
                      ₹ {(Number(lastBill.taxAmount) / 2).toFixed(2)}
                    </p>
                    <p style={{ fontSize: "7.6px", textAlign: "right" }}>
                      ₹ {(Number(lastBill.taxAmount) / 2).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
              <hr></hr>
              <div className="row-print">
                <div className="column-print">
                  <p style={{ fontSize: "9px", marginLeft: "2px", textAlign: "left" }}>
                    <strong>Total:</strong>
                  </p>
                </div>
                <div className="column-print">
                  <p style={{ fontSize: "9px", textAlign: "right" }}>
                    <strong>₹ {lastBill.finalAmount}</strong>
                  </p>
                </div>
              </div>
              <hr></hr>
              <div className="row-print">
                <div>
                  <p
                    style={{ fontSize: "5.5px", marginBottom: "8px", textAlign: "right" }}
                  >
                    Payment Mode: {lastBill.paymentMode}
                  </p>
                </div>
              </div>
            </div>
            <p className="centered">
              <strong>At Your Service. Thanks ^_^</strong>
            </p>
          </div>
        </div>
      </Box>

      <Box sx={{ mt: 3 }} className="hidden-print">
        <Button
          variant="contained"
          size="large"
          onClick={() => window.print()}
          endIcon={<PrintIcon />}
        >
          Print
        </Button>
      </Box>
    </Box>
  );
};

export default PrintInvoice;
