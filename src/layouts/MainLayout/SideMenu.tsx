import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/store";

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
  const { exportRecords, importRecords } = useStore();

  return (
    <Drawer anchor="left" open={drawer} onClose={toggleDrawer}>
      <Box
        role="presentation"
        onClick={toggleDrawer}
        onKeyDown={toggleDrawer}
        sx={{ width: "17rem" }}
      >
        <List>
          <ListItem>
            <ListItemText primary={t("layouts.main.backup")} />
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={exportRecords}>
              <ListItemIcon>
                <DownloadIcon />
              </ListItemIcon>
              <ListItemText primary={t("layouts.main.save")} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={importRecords}>
              <ListItemIcon>
                <UploadIcon />
              </ListItemIcon>
              <ListItemText primary={t("layouts.main.restore")} />
            </ListItemButton>
          </ListItem>
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
