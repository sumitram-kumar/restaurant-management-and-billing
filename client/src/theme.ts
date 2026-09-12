import { createTheme, Theme } from "@mui/material/styles";

export type ColorMode = "light" | "dark";

const bodyFont =
  '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const displayFont = '"Fraunces", Georgia, "Times New Roman", serif';

export function getTheme(mode: ColorMode): Theme {
  const isLight = mode === "light";

  const ink = isLight ? "#1A1512" : "#F3EFE9";
  const inkMuted = isLight ? "#6B6259" : "#B8AEA2";
  const paper = isLight ? "#FBF9F5" : "#141210";
  const surface = isLight ? "#FFFFFF" : "#1C1917";
  const hairline = isLight ? "rgba(26, 21, 18, 0.14)" : "rgba(243, 239, 233, 0.14)";
  const brick = isLight ? "#A8271F" : "#E2574B";

  return createTheme({
    palette: {
      mode,
      primary: { main: brick, contrastText: "#FFFFFF" },
      success: { main: isLight ? "#3F6B2E" : "#8FBC7A" },
      error: { main: isLight ? "#B3261E" : "#F2897F" },
      background: { default: paper, paper: surface },
      text: { primary: ink, secondary: inkMuted },
      divider: hairline,
    },
    shape: { borderRadius: 6 },
    typography: {
      fontFamily: bodyFont,
      h1: { fontFamily: displayFont, fontWeight: 600, letterSpacing: -0.5 },
      h2: { fontFamily: displayFont, fontWeight: 600, letterSpacing: -0.5 },
      h3: { fontFamily: displayFont, fontWeight: 600 },
      h4: { fontFamily: displayFont, fontWeight: 600 },
      h5: { fontFamily: displayFont, fontWeight: 600 },
      h6: { fontFamily: displayFont, fontWeight: 600 },
      subtitle1: { fontWeight: 700 },
      button: { fontWeight: 700, textTransform: "none", letterSpacing: 0.1 },
      overline: { letterSpacing: 1.2, fontWeight: 700 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundImage: "none" },
          "::selection": { backgroundColor: brick, color: "#FFFFFF" },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 4,
            paddingInline: 20,
            paddingBlock: 10,
          },
          outlined: { borderWidth: 1.5, "&:hover": { borderWidth: 1.5 } },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none", boxShadow: "none" },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            boxShadow: "none",
            border: `1px solid ${hairline}`,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            boxShadow: isLight
              ? "0 12px 40px rgba(26,21,18,0.18)"
              : "0 12px 40px rgba(0,0,0,0.5)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: { boxShadow: "none" },
        },
      },
      MuiTextField: {
        defaultProps: { size: "small" },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: 4 },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 700,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            color: inkMuted,
          },
          root: { borderColor: hairline },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 4, fontWeight: 700 },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: hairline },
        },
      },
    },
  });
}
