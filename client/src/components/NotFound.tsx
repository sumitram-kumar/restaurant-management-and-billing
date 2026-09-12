import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        textAlign: "center",
        px: 2,
      }}
    >
      <SentimentDissatisfiedRoundedIcon
        sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
      />
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Page not found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        The page you're looking for doesn't exist or was moved.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/home")}>
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default NotFound;
