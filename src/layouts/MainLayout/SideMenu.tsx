import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  styled,
} from "@mui/material";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SummarizeIcon from "@mui/icons-material/Summarize";
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
import { ParseKeys } from "i18next";
import { RouterPath } from "@/constants";

type MenuListItemProps = {
  path: string;
  icon: ReactNode;
  title: ParseKeys;
};
class MenuListItem {
  path: string;

  icon: ReactNode;

  title: ParseKeys;

  constructor(props: MenuListItemProps) {
    const { path, icon, title } = props;
    this.path = path;
    this.icon = icon;
    this.title = title;
  }
}

type MenuListSubheaderProps = {
  title: ParseKeys;
};

class MenuListSubheader {
  title: ParseKeys;

  constructor(props: MenuListSubheaderProps) {
    const { title } = props;
    this.title = title;
  }
}

const MenuList: (MenuListItem | MenuListSubheader)[] = [
  new MenuListSubheader({
    title: "layouts.main.subheader.planner",
  }),
  new MenuListItem({
    path: RouterPath.PLANNER,
    icon: <DateRangeIcon />,
    title: "layouts.main.planner",
  }),
  new MenuListItem({
    path: RouterPath.RACE_SUMMARY,
    icon: <SummarizeIcon />,
    title: "layouts.main.raceSummary",
  }),
  new MenuListItem({
    path: RouterPath.PACING,
    icon: <CloudDownloadIcon />,
    title: "layouts.main.pacing",
  }),
  new MenuListSubheader({
    title: "layouts.main.subheader.settings",
  }),
  new MenuListItem({
    path: RouterPath.BACKUP,
    icon: <CloudDownloadIcon />,
    title: "layouts.main.backup",
  }),
];

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
          {MenuList.map((item, idx) =>
            item instanceof MenuListItem ? (
              <Link to={item.path} key={idx}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={t(item.title)} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ) : (
              <ListSubheader key={idx}>{t(item.title)}</ListSubheader>
            )
          )}
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
