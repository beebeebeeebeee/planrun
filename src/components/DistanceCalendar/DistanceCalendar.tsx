import "./DistanceCalendar.css";

import Calendar, { TileArgs } from "react-calendar";
import { Box, Typography } from "@mui/material";
import { Value } from "react-calendar/dist/cjs/shared/types";
import { DefaultLanguage } from "@/i18n";

export type DistanceCalendarProps = {
  viewDate: Value;
  onViewDateChange: (value: Value) => void;
  tileDistance: (date: Date) => number;
};

export function DistanceCalendar(props: DistanceCalendarProps): JSX.Element {
  const { onViewDateChange, viewDate, tileDistance } = props;

  return (
    <Calendar
      calendarType="iso8601"
      locale={DefaultLanguage}
      onChange={onViewDateChange}
      value={viewDate}
      tileContent={(t: TileArgs): JSX.Element | undefined => {
        const r = tileDistance(t.date);

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
                  {`${r}k`}
                </Typography>
              </Box>
            ) : (
              <>-</>
            )}
          </Box>
        );
      }}
    />
  );
}
