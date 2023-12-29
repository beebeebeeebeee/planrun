import "./DistanceCalendar.css";

import Calendar, { TileArgs } from "react-calendar";
import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { CalendarProps } from "react-calendar/src/Calendar";
import { DefaultLanguage } from "@/i18n";

export type DistanceCalendarProps = {
  tileDistance: (date: Date) => number;
} & CalendarProps;

export function DistanceCalendar(_props: DistanceCalendarProps): ReactNode {
  const { tileDistance, ...props } = _props;

  const { t } = useTranslation();

  return (
    <Calendar
      calendarType="iso8601"
      locale={DefaultLanguage}
      prev2Label={null}
      next2Label={null}
      tileContent={(tile: TileArgs): JSX.Element | undefined => {
        const r = tileDistance(tile.date);

        return (
          <Box sx={{ verticalAlign: "center", mt: 0.3 }}>
            {r > 0 ? (
              <Box
                sx={(theme) => ({
                  bgcolor: theme.palette.secondary.main,
                  borderRadius: "0.25rem",
                  width: "100%",
                  p: "0.2rem",
                })}
              >
                <Typography
                  sx={(theme) => ({
                    fontSize: "0.74rem",
                    color: theme.palette.secondary.contrastText,
                  })}
                >
                  {t("unit.distance.k", { distance: r })}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  p: "0.2rem",
                }}
              >
                -
              </Box>
            )}
          </Box>
        );
      }}
      {...props}
    />
  );
}
