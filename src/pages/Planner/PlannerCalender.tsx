import { ReactNode, useCallback, useMemo, useState } from "react";
import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { OnArgs } from "react-calendar/src/shared/types";
import { Value } from "react-calendar/dist/cjs/shared/types";
import { DistanceCalendar } from "@/components";
import { dateUtil } from "@/utils";
import { RunRecord } from "@/entity";

type PlannerCalenderProp = {
  records: RunRecord[];
  viewDate: Value;
  onViewDateChange: (date: Value) => void;
  getDistanceByDate: (date: Date) => number;
};

export function PlannerCalender(props: PlannerCalenderProp): ReactNode {
  const { records, viewDate, onViewDateChange, getDistanceByDate } = props;

  const { t } = useTranslation();

  const [viewMonth, setViewMonth] = useState<Date | undefined>(new Date());

  const onActiveStartDateChange = useCallback((onArgs: OnArgs) => {
    setViewMonth(
      onArgs.view === "month" ? onArgs.activeStartDate ?? undefined : undefined
    );
  }, []);

  const weekNumberDistanceMap = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(
          viewMonth !== undefined
            ? dateUtil.getAllWeekRangeOfAMonth(viewMonth)
            : {}
        ).map(([key, value]) => [
          key,
          records
            .filter(({ date }) =>
              dateUtil.isBetween(
                new Date(`${date} 00:00:00`),
                value[0],
                value[1]
              )
            )
            .reduce((pv, cv) => pv + cv.distance, 0),
        ])
      ),
    [records, viewMonth]
  );

  const tileDistance = useCallback(
    (date: Date) => {
      return viewMonth !== undefined ? getDistanceByDate(date) : 0;
    },
    [getDistanceByDate, viewMonth]
  );

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={0.6}>
        <DistanceCalendar
          value={viewDate}
          onChange={onViewDateChange}
          tileDistance={tileDistance}
          onActiveStartDateChange={onActiveStartDateChange}
        />
        <Grid
          container
          direction="column"
          justifyContent={"space-evenly"}
          alignItems={"flex-end"}
          sx={{
            width: "4.5%",
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          <Grid item sx={{ height: "5.6rem", color: "white" }}>
            {"-"}
          </Grid>
          {Object.entries(weekNumberDistanceMap).map(([key, value]) => (
            <Grid
              item
              key={key}
              sx={{
                height: "4.0rem",
                textAlign: "center",
              }}
            >
              <Box
                sx={(theme) => ({
                  bgcolor: theme.palette.info.main,
                  color: theme.palette.info.contrastText,
                  borderRadius: "0.25rem",
                  width: "100%",
                })}
              >
                <Typography>
                  {t("unit.distance.k", {
                    distance: value,
                  })}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Stack>
      <Divider />
    </Stack>
  );
}
