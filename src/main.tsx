import "@fontsource/poppins";

import React from "react";
import ReactDOM from "react-dom/client";
import { Experimental_CssVarsProvider, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { registerI18n } from "@/i18n";
import { createCssTheme, createTheme } from "@/styles";
import { StoreProvider } from "@/store";
import { router } from "@/routers";

registerI18n();

const theme = createTheme();
const cssTheme = createCssTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <Experimental_CssVarsProvider theme={cssTheme}>
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </Experimental_CssVarsProvider>
  </ThemeProvider>
);
