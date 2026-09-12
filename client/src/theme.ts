import { createTheme, Theme } from "@mui/material/styles";

export type ColorMode = "light" | "dark";

const fontFamily =
  '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

const shape = { borderRadius: 12 };

const lightShadow = "0 1px 2px rgba(15, 17, 23, 0.04), 0 8px 24px rgba(15, 17, 23, 0.06)";
const darkShadow = "0 1px 2px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0, 0, 0, 0.4)";

export function getTheme(mode: ColorMode): Theme {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isLight ? "#6D5EF8" : "#9B8FFF",
        contrastText: "#FFFFFF",
      },
      success: {
        main: isLight ? "#16A34A" : "#4ADE80",
      },
      error: {
        main: isLight ? "#DC2626" : "#F87171",
      },
      background: {
        default: isLight ? "#F6F6FB" : "#0E0F14",
        paper: isLight ? "#FFFFFF" : "#171922",
      },
      text: {
        primary: isLight ? "#16161F" : "#F2F2F5",
        secondary: isLight ? "#6B7080" : "#9CA0AE",
      },
      divider: isLight ? "rgba(22, 22, 31, 0.08)" : "rgba(255, 255, 255, 0.08)",
    },
    shape,
    typography: {
      fontFamily,
      h1: { fontWeight: 800 },
      h2: { fontWeight: 800 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { fontWeight: 600, textTransform: "none" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: "none",
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 10,
            paddingInline: 18,
            paddingBlock: 10,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
          elevation1: { boxShadow: isLight ? lightShadow : darkShadow },
          elevation3: { boxShadow: isLight ? lightShadow : darkShadow },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: isLight ? lightShadow : darkShadow,
            border: `1px solid ${isLight ? "rgba(22,22,31,0.06)" : "rgba(255,255,255,0.06)"}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            borderBottom: `1px solid ${isLight ? "rgba(22,22,31,0.08)" : "rgba(255,255,255,0.08)"}`,
          },
        },
      },
      MuiTextField: {
        defaultProps: { size: "small" },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: 10 },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: { fontWeight: 700 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8, fontWeight: 600 },
        },
      },
    },
  });
}
