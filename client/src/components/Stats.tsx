import { useState } from "react";
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
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { getStats } from "../api/stats";
import { getErrorMessage } from "../api/errorMessage";
import { StatsResponse } from "../types";
import type { Dayjs } from "dayjs";

const money = (value: string | number | null | undefined) =>
  Number(value ?? 0).toFixed(2);

const SUMMARY_TILES: Array<{ key: keyof StatsResponse["totals"]; label: string }> = [
  { key: "subtotal", label: "Subtotal" },
  { key: "discountAmount", label: "Discounts" },
  { key: "taxAmount", label: "Total Tax" },
  { key: "finalAmount", label: "Total Sales" },
];

const Stats = () => {
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleShow = async () => {
    if (!fromDate || !toDate) {
      toast.error("Pick both dates!");
      return;
    }

    setIsLoading(true);
    try {
      const data = await getStats(
        fromDate.format("YYYY-MM-DD"),
        toDate.format("YYYY-MM-DD")
      );
      setStats(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load stats"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Pick a date range to see item-wise sales and totals.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
          mb: 4,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="From"
            inputFormat="YYYY-MM-DD"
            value={fromDate}
            disabled={isLoading}
            onChange={setFromDate}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="To"
            inputFormat="YYYY-MM-DD"
            value={toDate}
            disabled={isLoading}
            onChange={setToDate}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Button
          variant="contained"
          disabled={isLoading}
          startIcon={
            isLoading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <SearchRoundedIcon />
            )
          }
          onClick={handleShow}
        >
          {isLoading ? "Loading..." : "Show"}
        </Button>
      </Box>

      {!stats && !isLoading && (
        <>
          <Divider sx={{ mb: 4 }} />
          <Box sx={{ textAlign: "center", py: 6 }}>
            <InsightsRoundedIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
            <Typography color="text.secondary">
              Pick a date range and click Show to see results.
            </Typography>
          </Box>
        </>
      )}

      {isLoading && (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      )}

      {stats && !isLoading && (
        <>
          <Divider sx={{ mb: 4 }} />
          <Box
            sx={{
              display: "flex",
              gap: 5,
              mb: 4,
              flexWrap: "wrap",
            }}
          >
            {SUMMARY_TILES.map((tile) => (
              <Box key={tile.key}>
                <Typography variant="overline" color="text.secondary">
                  {tile.label}
                </Typography>
                <Typography
                  sx={{ fontFamily: '"Fraunces", serif', fontSize: 32, fontWeight: 600 }}
                >
                  {`₹${money(stats.totals[tile.key])}`}
                </Typography>
              </Box>
            ))}
          </Box>

          <Card>
            <TableContainer sx={{ maxHeight: "50vh" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Food Name</TableCell>
                    <TableCell align="right">Total Sales</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.salesByItem.map((row) => (
                    <TableRow key={row.foodName} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{row.foodName}</TableCell>
                      <TableCell align="right">{`₹${money(row.totalSales)}`}</TableCell>
                    </TableRow>
                  ))}
                  {stats.salesByItem.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No sales in this date range.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}
    </Box>
  );
};

export default Stats;
