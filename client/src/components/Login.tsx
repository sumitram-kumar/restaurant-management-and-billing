import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { useAuth0 } from "@auth0/auth0-react";
import { useColorMode } from "../context/ColorModeContext";

const Login = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const { mode, toggleMode } = useColorMode();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        position: "relative",
        px: 2,
      }}
    >
      <IconButton
        onClick={toggleMode}
        sx={{ position: "absolute", top: 20, right: 20 }}
        aria-label="Toggle color mode"
      >
        {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
      </IconButton>

      <Card sx={{ width: "100%", maxWidth: 400 }}>
        <CardContent sx={{ p: { xs: 3, sm: 5 }, textAlign: "center" }}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 56,
              height: 56,
              mx: "auto",
              mb: 3,
            }}
          >
            <StorefrontRoundedIcon />
          </Avatar>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            Restaurant Billing
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to manage your menu, invoices and sales reports.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            onClick={() => loginWithRedirect()}
            endIcon={<LoginRoundedIcon />}
          >
            {isLoading ? "Loading..." : "Log In"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
