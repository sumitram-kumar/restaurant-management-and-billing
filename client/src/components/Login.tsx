import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
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
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2.5 }}>
        <IconButton onClick={toggleMode} aria-label="Toggle color mode">
          {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
        </IconButton>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
        }}
      >
        <Box sx={{ maxWidth: 420, width: "100%" }}>
          <Typography
            variant="overline"
            color="primary.main"
            sx={{ display: "block", mb: 1.5 }}
          >
            Restaurant Billing
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 600,
              fontSize: { xs: 40, sm: 52 },
              lineHeight: 1.05,
              mb: 2,
            }}
          >
            Run the till,
            <br />
            without the chaos.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to manage your menu, invoices and sales reports.
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Button
            variant="contained"
            size="large"
            disabled={isLoading}
            onClick={() => loginWithRedirect()}
            endIcon={<ArrowForwardRoundedIcon />}
          >
            {isLoading ? "Loading..." : "Log In"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
