import { createBrowserRouter } from "react-router-dom";
import { RouterPath } from "@/constants/router";
import { MainLayout } from "@/layouts";
import { Planner, Backup, Pacing } from "@/pages";
import { RaceSummary } from "@/pages/RaceSummary";

export const router = createBrowserRouter(
  [
    {
      path: RouterPath.ROOT,
      element: <MainLayout />,
      children: [
        {
          path: RouterPath.PLANNER,
          element: <Planner />,
        },
        {
          path: RouterPath.RACE_SUMMARY,
          element: <RaceSummary />,
        },
        {
          path: RouterPath.PACING,
          element: <Pacing />,
        },
        {
          path: RouterPath.BACKUP,
          element: <Backup />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
