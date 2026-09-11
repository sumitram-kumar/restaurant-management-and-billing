import React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "./styles/Home.css";
import Navbar from "./Navbar";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="navbar">
        <Navbar showText="DASHBOARD" />
      </div>

      <div className="box-home">
        <Box sx={{ "& button": { m: 1 } }}>
          <div>
            <Button
              className="home"
              color="success"
              variant="contained"
              size="large"
              onClick={() => navigate("/invoice")}
            >
              Invoice
            </Button>
            <Button
              className="home"
              color="success"
              variant="contained"
              size="large"
              onClick={() => navigate("/menu")}
            >
              Menu
            </Button>
            <Button
              className="home"
              color="success"
              variant="contained"
              size="large"
              onClick={() => navigate("/showStats")}
            >
              Stats
            </Button>
            <Button
              className="home"
              color="success"
              variant="contained"
              size="large"
              onClick={() => navigate("/tax")}
            >
              Tax
            </Button>
          </div>
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

export default Home;
