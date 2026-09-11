import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { useAuth0 } from "@auth0/auth0-react";
import "./styles/Login.css";
import Navbar from "./Navbar";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";

const Login = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  if (isAuthenticated) {
    navigate("/home");
  }

  return (
    <div>
      <div className="navbar">
        <Navbar showText="ADMIN" />
      </div>
      <div>
        <h1 className="loginHead">KALIKA DHABA</h1>
        <h2 className="loginSub">WELCOME AGAIN!</h2>
      </div>
      <div>
        <Button
          className="login-btn"
          variant="contained"
          onClick={() => loginWithRedirect()}
          color="primary"
          size="large"
        >
          Click Here To Login
        </Button>
        <Button
          className="login-btn"
          variant="contained"
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          color="primary"
          size="large"
        >
          Logout
        </Button>
      </div>
      <div>
        <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation sx={{ backgroundColor: "primary.main" }} />
        </Paper>
      </div>
    </div>
  );
};

export default Login;
