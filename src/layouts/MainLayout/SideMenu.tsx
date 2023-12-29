import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { useStore } from "@/store";
import { RouterPath } from "@/constants";

const Link = styled(RouterLink)`
  color: inherit;
  text-decoration: none;
`;

type SideMenuContextValue = {
  sideMenu: ReactNode;
  toggleDrawer: () => void;
};

const SideMenuContext = createContext<SideMenuContextValue | undefined>(
  undefined
);

type SideMenuProps = {
  drawer: boolean;
  toggleDrawer: () => void;
};

function SideMenu(props: SideMenuProps): ReactNode {
  const { drawer, toggleDrawer } = props;

  const { t } = useTranslation();
  return (
    <Drawer anchor="left" open={drawer} onClose={toggleDrawer}>
      <Box
        role="presentation"
        onClick={toggleDrawer}
        onKeyDown={toggleDrawer}
        sx={{ width: "17rem" }}
      >
        <List>
          <Link to={RouterPath.PLANNER}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <DateRangeIcon />
                </ListItemIcon>
                <ListItemText primary={t("layouts.main.planner")} />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to={RouterPath.BACKUP}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <CloudDownloadIcon />
                </ListItemIcon>
                <ListItemText primary={t("layouts.main.backup")} />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
      </Box>
    </Drawer>
  );
}

export function SideMenuProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const [drawer, setDrawer] = useState(false);

  const toggleDrawer = useCallback(() => {
    setDrawer((d) => !d);
  }, []);

  const sideMenu = useMemo(
    () => <SideMenu drawer={drawer} toggleDrawer={toggleDrawer} />,
    [drawer, toggleDrawer]
  );

  const value: SideMenuContextValue = useMemo(
    () => ({ sideMenu, toggleDrawer }),
    [sideMenu, toggleDrawer]
  );

  return (
    <SideMenuContext.Provider value={value}>
      {children}
    </SideMenuContext.Provider>
  );
}

export function useSideMenu(): SideMenuContextValue {
  const context = useContext(SideMenuContext);
  if (context === undefined) {
    throw new Error("useSideMenu must be used within a SideMenuProvider");
  }
  return context;
}
