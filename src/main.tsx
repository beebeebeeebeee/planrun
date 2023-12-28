import "@fontsource/poppins";

import React from "react";
import ReactDOM from "react-dom/client";
import { Experimental_CssVarsProvider, ThemeProvider } from "@mui/material";
import { MainLayout } from "@/layouts";
import { Planner } from "@/pages";
import { registerI18n } from "@/i18n";
import { createCssTheme, createTheme } from "@/styles";
import { StoreProvider } from "@/store";

registerI18n();

const theme = createTheme();
const cssTheme = createCssTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Experimental_CssVarsProvider theme={cssTheme}>
        <StoreProvider>
          <MainLayout>
            <Planner />
          </MainLayout>
        </StoreProvider>
      </Experimental_CssVarsProvider>
    </ThemeProvider>
  </React.StrictMode>
);
