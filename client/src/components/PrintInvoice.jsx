import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import PrintIcon from "@mui/icons-material/Print";
import "./styles/PrintInvoice.css";
import Navbar from "./Navbar";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import { useBillDraft } from "../context/BillContext";

const style = {
  fontSize: "7.6px",
  fontFamily: "Helvetica",
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
    <div>
      <div className="hidden-print navbar">
        <Navbar showText="PRINT INVOICE" />
      </div>
      <div style={style}>
        <div className="ticket">
          <p className="centered">
            <strong>KALIKA DHABA</strong>
            <br></br>IGNOU Road,<br></br>Neb Sarai, New Delhi, 110068
          </p>
          <div className="row-print">
            <div className="column-print">
              <p style={{ fontSize: "7px" }} align="left">
                Order#{lastBill.billNumber}
              </p>
            </div>
            <div className="column-print">
              <p style={{ fontSize: "7px" }} align="right">
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
                <p style={{ fontSize: "7.6px", marginLeft: "2px" }} align="left">
                  Subtotal:
                </p>
              </div>
              <div className="column-print">
                <p style={{ fontSize: "7.6px" }} align="right">
                  ₹ {lastBill.subtotal}
                </p>
              </div>
            </div>
            {Number(lastBill.discountAmount) > 0 && (
              <div className="row-print">
                <div className="column-print">
                  <p style={{ fontSize: "7.6px", marginLeft: "2px" }} align="left">
                    (-) Discount:
                  </p>
                </div>
                <div className="column-print">
                  <p style={{ fontSize: "7.6px" }} align="right">
                    ₹ {lastBill.discountAmount}
                  </p>
                </div>
              </div>
            )}
            {(cgst > 0 || sgst > 0) && (
              <div className="row-print">
                <div className="column-print">
                  <p style={{ fontSize: "7.6px", marginLeft: "2px" }} align="left">
                    CGST@ {cgst}%
                  </p>
                  <p style={{ fontSize: "7.6px", marginLeft: "2px" }} align="left">
                    SGST@ {sgst}%
                  </p>
                </div>
                <div className="column-print">
                  <p style={{ fontSize: "7.6px" }} align="right">
                    ₹ {(Number(lastBill.taxAmount) / 2).toFixed(2)}
                  </p>
                  <p style={{ fontSize: "7.6px" }} align="right">
                    ₹ {(Number(lastBill.taxAmount) / 2).toFixed(2)}
                  </p>
                </div>
              </div>
            )}
            <hr></hr>
            <div className="row-print">
              <div className="column-print">
                <p style={{ fontSize: "9px", marginLeft: "2px" }} align="left">
                  <strong>Total:</strong>
                </p>
              </div>
              <div className="column-print">
                <p style={{ fontSize: "9px" }} align="right">
                  <strong>₹ {lastBill.finalAmount}</strong>
                </p>
              </div>
            </div>
            <hr></hr>
            <div className="row-print">
              <div>
                <p style={{ fontSize: "5.5px", marginBottom: "8px" }} align="right">
                  Payment Mode: {lastBill.paymentMode}
                </p>
              </div>
            </div>
          </div>
          <p className="centered">
            <strong>At Your Service. Thanks ^_^</strong>
          </p>
          <br></br>
          <br></br>
          <Button
            id="btnPrint"
            className="hidden-print"
            variant="contained"
            size="large"
            color="success"
            onClick={() => window.print()}
            endIcon={<PrintIcon />}
          >
            PRINT
          </Button>
        </div>
      </div>
      <div className="hidden-print">
        <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation sx={{ backgroundColor: "primary.main" }} />
        </Paper>
      </div>
    </div>
  );
};

export default PrintInvoice;
