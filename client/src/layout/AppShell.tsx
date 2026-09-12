import { ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { useColorMode } from "../context/ColorModeContext";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/home" },
  { label: "Invoice", path: "/invoice" },
  { label: "Menu", path: "/menu" },
  { label: "Stats", path: "/showStats" },
  { label: "Tax", path: "/tax" },
];

interface AppShellProps {
  title: string;
  children: ReactNode;
}

export function AppShell({ title, children }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth0();
  const { mode, toggleMode } = useColorMode();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname.toLowerCase() === path.toLowerCase();

  const handleLogout = () =>
    logout({
      logoutParams: { returnTo: window.location.origin + process.env.PUBLIC_URL },
    });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box
        component="header"
        className="no-print"
        sx={{
          borderBottom: "3px solid",
          borderColor: "primary.main",
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 2,
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              onClick={() => navigate("/home")}
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 700,
                cursor: "pointer",
                flexShrink: 0,
                fontSize: { xs: 20, sm: 24 },
              }}
            >
              Restaurant Billing
            </Typography>

            {isDesktop && (
              <Box component="nav" sx={{ display: "flex", gap: 3.5 }}>
                {NAV_ITEMS.map((item) => (
                  <Box
                    key={item.path}
                    component="button"
                    onClick={() => navigate(item.path)}
                    sx={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      p: 0,
                      fontFamily: "inherit",
                      fontSize: 15,
                      fontWeight: isActive(item.path) ? 700 : 500,
                      color: isActive(item.path) ? "primary.main" : "text.primary",
                      borderBottom: "2px solid",
                      borderColor: isActive(item.path) ? "primary.main" : "transparent",
                      pb: 0.5,
                      transition: "color 0.15s, border-color 0.15s",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    {item.label}
                  </Box>
                ))}
              </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
              <Tooltip title={mode === "light" ? "Dark mode" : "Light mode"}>
                <IconButton onClick={toggleMode} size="small">
                  {mode === "light" ? (
                    <DarkModeRoundedIcon fontSize="small" />
                  ) : (
                    <LightModeRoundedIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              {isDesktop ? (
                <Tooltip title="Log out">
                  <IconButton onClick={handleLogout} size="small">
                    <LogoutRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : (
                <IconButton onClick={() => setMobileOpen(true)} size="small">
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 240, pt: 1 }} role="presentation">
          <List>
            {NAV_ITEMS.map((item) => (
              <ListItemButton
                key={item.path}
                selected={isActive(item.path)}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: isActive(item.path) ? 700 : 500 }}
                />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <List>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Log out" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 5 } }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 28, sm: 34 },
            mb: { xs: 3, sm: 4 },
          }}
        >
          {title}
        </Typography>
        {children}
      </Container>
    </Box>
  );
}
