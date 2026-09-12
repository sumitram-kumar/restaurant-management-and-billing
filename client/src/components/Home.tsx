import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import PercentRoundedIcon from "@mui/icons-material/PercentRounded";
import { ComponentType } from "react";
import { SvgIconProps } from "@mui/material/SvgIcon";

interface Tile {
  label: string;
  description: string;
  path: string;
  icon: ComponentType<SvgIconProps>;
  color: "primary" | "success" | "warning" | "info";
}

const TILES: Tile[] = [
  {
    label: "New Invoice",
    description: "Ring up an order and print a receipt",
    path: "/invoice",
    icon: ReceiptLongRoundedIcon,
    color: "primary",
  },
  {
    label: "Menu",
    description: "Manage items, categories and prices",
    path: "/menu",
    icon: RestaurantMenuRoundedIcon,
    color: "success",
  },
  {
    label: "Stats",
    description: "Sales and tax reports over a date range",
    path: "/showStats",
    icon: InsightsRoundedIcon,
    color: "info",
  },
  {
    label: "Tax",
    description: "Update the current CGST / SGST rate",
    path: "/tax",
    icon: PercentRoundedIcon,
    color: "warning",
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} gutterBottom>
        Welcome back
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Pick up where you left off, or start a new invoice.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
        }}
      >
        {TILES.map((tile) => (
          <Card key={tile.path}>
            <CardActionArea onClick={() => navigate(tile.path)} sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: `${tile.color}.main`,
                    color: `${tile.color}.contrastText`,
                    width: 44,
                    height: 44,
                    mb: 2,
                  }}
                >
                  <tile.icon />
                </Avatar>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {tile.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tile.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Home;
