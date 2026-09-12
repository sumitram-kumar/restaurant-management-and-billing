import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const ITEMS = [
  {
    n: "01",
    label: "New Invoice",
    description: "Ring up an order and print a receipt",
    path: "/invoice",
  },
  {
    n: "02",
    label: "Menu",
    description: "Manage items, categories and prices",
    path: "/menu",
  },
  {
    n: "03",
    label: "Stats",
    description: "Sales and tax reports over a date range",
    path: "/showStats",
  },
  {
    n: "04",
    label: "Tax",
    description: "Update the current CGST / SGST rate",
    path: "/tax",
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 480 }}>
        Pick up where you left off, or start a new invoice.
      </Typography>

      <Divider sx={{ borderColor: "text.primary", opacity: 0.2 }} />
      {ITEMS.map((item) => (
        <Box key={item.path}>
          <Box
            component="button"
            onClick={() => navigate(item.path)}
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              py: { xs: 2.5, sm: 3.5 },
              gap: { xs: 2, sm: 4 },
              "&:hover .home-arrow": { transform: "translateX(6px)", opacity: 1 },
              "&:hover .home-label": { color: "primary.main" },
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Fraunces", serif',
                fontSize: { xs: 24, sm: 32 },
                color: "text.secondary",
                fontWeight: 500,
                flexShrink: 0,
                width: { xs: 36, sm: 56 },
              }}
            >
              {item.n}
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                className="home-label"
                sx={{
                  fontFamily: '"Fraunces", serif',
                  fontSize: { xs: 22, sm: 30 },
                  fontWeight: 600,
                  transition: "color 0.15s",
                }}
              >
                {item.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </Box>
            <ArrowForwardRoundedIcon
              className="home-arrow"
              sx={{
                opacity: 0.3,
                transition: "transform 0.15s, opacity 0.15s",
                flexShrink: 0,
              }}
            />
          </Box>
          <Divider />
        </Box>
      ))}
    </Box>
  );
};

export default Home;
