import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTranslation } from "react-i18next";
import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { SideMenuProvider, useSideMenu } from "@/layouts";

export function _MainLayout(): ReactNode {
  const { t } = useTranslation();
  const { sideMenu, toggleDrawer } = useSideMenu();

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t("layouts.main.title")}
          </Typography>
        </Toolbar>
      </AppBar>
      {sideMenu}
      <Container maxWidth="sm" sx={{ py: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

export function MainLayout(): ReactNode {
  return (
    <SideMenuProvider>
      <_MainLayout />
    </SideMenuProvider>
  );
}
