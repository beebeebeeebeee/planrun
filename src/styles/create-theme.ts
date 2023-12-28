import {
  createTheme as createMuiTheme, CssVarsTheme,
  experimental_extendTheme,
  Theme,
  ThemeOptions,
} from "@mui/material";
import { createPalette } from "./create-palette";
import { createComponents } from "./create-components";
import { createShadows } from "./create-shadows";
import { createTypography } from "./create-typography";

export function createThemeOptions(): ThemeOptions {
  const palette = createPalette();
  const components = createComponents({ palette });
  const shadows: any = createShadows();
  const typography: any = createTypography();

  return {
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1440,
      },
    },
    components,
    palette,
    shadows,
    shape: {
      borderRadius: 8,
    },
    typography,
  };
}

export function createTheme(): Theme {
  return createMuiTheme(createThemeOptions());
}
export function createCssTheme(): CssVarsTheme {
  return experimental_extendTheme(createThemeOptions());
}
