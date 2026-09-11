import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./styles/Stats.css";
import Navbar from "./Navbar";
import BottomNavigation from "@mui/material/BottomNavigation";
import { getStats } from "../api/stats";
import { getErrorMessage } from "../api/errorMessage";
import { StatsResponse } from "../types";
import type { Dayjs } from "dayjs";

const money = (value: string | number | null | undefined) =>
  Number(value ?? 0).toFixed(2);

const Stats = () => {
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);

  const handleShow = async () => {
    if (!fromDate || !toDate) {
      toast.error("Pick both dates!");
      return;
    }

    try {
      const data = await getStats(
        fromDate.format("YYYY-MM-DD"),
        toDate.format("YYYY-MM-DD")
      );
      setStats(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load stats"));
    }
  };

  return (
    <div>
      <div className="navbar">
        <Navbar showText="STATS" />
      </div>
      <div className="outer">
        <div className="inner">
          <div className="child">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Begin"
                inputFormat="YYYY-MM-DD"
                value={fromDate}
                onChange={setFromDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
          <div className="child">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="End"
                inputFormat="YYYY-MM-DD"
                value={toDate}
                onChange={setToDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
          <div className="child">
            <Button
              className="stats-btn"
              color="success"
              variant="contained"
              size="large"
              onClick={handleShow}
            >
              SHOW
            </Button>
          </div>
        </div>
      </div>

      {stats && (
        <div className="statsTab">
          <Paper
            sx={{
              width: "55%",
              overflow: "hidden",
              textAlign: "center",
              margin: "auto",
            }}
          >
            <TableContainer sx={{ maxHeight: "40rem" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <strong>Sr. No.</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Food Name</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Total Sales</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.salesByItem.map((row, i) => (
                    <TableRow
                      key={row.foodName}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" align="center">
                        {i + 1}
                      </TableCell>
                      <TableCell align="center">{row.foodName}</TableCell>
                      <TableCell align="center">₹ {money(row.totalSales)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <br></br>
          <Button
            variant="contained"
            color="error"
            className="stats-btn"
            onClick={() => setOpen(true)}
          >
            More Information
          </Button>
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              <u>
                {"Data from " +
                  fromDate?.format("YYYY-MM-DD") +
                  " to " +
                  toDate?.format("YYYY-MM-DD")}
              </u>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <strong>Subtotal: ₹ {money(stats.totals.subtotal)}</strong>
                <br></br>
                <br></br>
                <strong>Discounts: ₹ {money(stats.totals.discountAmount)}</strong>
                <br></br>
                <br></br>
                <strong>Total Taxes: ₹ {money(stats.totals.taxAmount)}</strong>
                <br></br>
                <br></br>
                <strong>Total Sales: ₹ {money(stats.totals.finalAmount)}</strong>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)} autoFocus>
                Looks Good?
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
      <div>
        <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation sx={{ backgroundColor: "primary.main" }} />
        </Paper>
      </div>
    </div>
  );
};

export default Stats;
