import { common } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";
import {
  ColorPartial,
  SimplePaletteColorOptions,
  TypeAction,
  TypeBackground,
  TypeText,
} from "@mui/material/styles/createPalette";
import { PaletteMode } from "@mui/material";
import { error, indigo, info, neutral, success, warning } from "./colors";

export type PaletteOptions = {
  action: Partial<TypeAction>;
  background: Partial<TypeBackground>;
  divider: string;
  error: SimplePaletteColorOptions;
  info: SimplePaletteColorOptions;
  mode: PaletteMode;
  neutral: ColorPartial;
  primary: SimplePaletteColorOptions;
  success: SimplePaletteColorOptions;
  text: Partial<TypeText>;
  warning: SimplePaletteColorOptions;
};

function createLightPalette(): PaletteOptions {
  return {
    action: {
      active: neutral[500],
      disabled: alpha(neutral[900]!, 0.38),
      disabledBackground: alpha(neutral[900]!, 0.12),
      focus: alpha(neutral[900]!, 0.16),
      hover: alpha(neutral[900]!, 0.04),
      selected: alpha(neutral[900]!, 0.12),
    },
    background: {
      default: common.white,
      paper: common.white,
    },
    divider: "#F2F4F7",
    error,
    info,
    mode: "light",
    neutral,
    primary: indigo,
    success,
    text: {
      primary: neutral[900],
      secondary: neutral[500],
      disabled: alpha(neutral[900]!, 0.38),
    },
    warning,
  };
}

function createDarkPalette(): PaletteOptions {
  return {
    action: {
      active: neutral[500],
      disabled: alpha(neutral[100]!, 0.38),
      disabledBackground: alpha(neutral[100]!, 0.12),
      focus: alpha(neutral[100]!, 0.16),
      hover: alpha(neutral[100]!, 0.04),
      selected: alpha(neutral[100]!, 0.12),
    },
    background: {
      default: neutral[900],
      paper: neutral[900],
    },
    divider: "#555657",
    error,
    info,
    mode: "dark",
    neutral,
    primary: indigo,
    success,
    text: {
      primary: neutral[100],
      secondary: neutral[400],
      disabled: alpha(neutral[100]!, 0.38),
    },
    warning,
  };
}

export function createPalette(): PaletteOptions {
  return createLightPalette();
}
