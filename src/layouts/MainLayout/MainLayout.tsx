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
import { SideMenuProvider, useSideMenu } from "@/layouts";

export type MainLayoutProps = {
  children: JSX.Element | JSX.Element[] | boolean | undefined;
};

export function _MainLayout(props: MainLayoutProps): JSX.Element {
  const { children } = props;

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
        {children}
      </Container>
    </Box>
  );
}

export function MainLayout(props: MainLayoutProps): JSX.Element {
  return (
    <SideMenuProvider>
      <_MainLayout {...props} />
    </SideMenuProvider>
  );
}
