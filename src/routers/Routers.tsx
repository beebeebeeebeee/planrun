import { createBrowserRouter } from "react-router-dom";
import { RouterPath } from "@/constants/router";
import { MainLayout } from "@/layouts";
import { Planner, Backup } from "@/pages";

export const router = createBrowserRouter([
  {
    path: RouterPath.ROOT,
    element: <MainLayout />,
    children: [
      {
        path: RouterPath.PLANNER,
        element: <Planner />,
      },
      {
        path: RouterPath.BACKUP,
        element: <Backup />,
      },
    ],
  },
]);
