import { ReactNode, useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { OnArgs } from "react-calendar/src/shared/types";
import { DistanceCalendar } from "@/components";
import { dateUtil } from "@/utils";
import { useCreateRecordDialog } from "@/pages";
import { RunRecord } from "@/entity";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

type PlannerCalenderProp = {
  records: RunRecord[];
};

export function PlannerCalender(props: PlannerCalenderProp): ReactNode {
  const { records } = props;

  const { t } = useTranslation();
  const { toggleDialog } = useCreateRecordDialog()!;

  const [viewDate, onViewDateChange] = useState<Value>(new Date());
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

  const getRecordsByDate = useCallback(
    (date: Date) =>
      records.filter(
        ({ date: rdate }) =>
          dateUtil.toDateString(rdate) === dateUtil.toDateString(date)
      ),
    [records]
  );

  const getDistanceByDate = useCallback(
    (date: Date) =>
      getRecordsByDate(date).reduce((pv, cv) => pv + cv.distance, 0),
    [getRecordsByDate]
  );

  const tileDistance = useCallback(
    (date: Date) => {
      return viewMonth !== undefined ? getDistanceByDate(date) : 0;
    },
    [getDistanceByDate, viewMonth]
  );

  const currentDateRecord = useMemo(
    () => getRecordsByDate(viewDate as Date),
    [getRecordsByDate, viewDate]
  );

  const currentDateDistance = useMemo(
    () => getDistanceByDate(viewDate as Date),
    [getDistanceByDate, viewDate]
  );

  return (
    <Stack spacing={2}>
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
      <Stack direction="row" justifyContent="space-between">
        <Typography>
          {dateUtil.toDateString(viewDate as Date)}{" "}
          {t(
            `unit.weekday.${
              (viewDate as Date).getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6
            }`
          )}
        </Typography>
        <Typography>
          {t("unit.distance.km", { distance: currentDateDistance })}
        </Typography>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {currentDateRecord.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} sx={{ textAlign: "center" }}>
                  {t("pages.planner.noRecords")}
                </TableCell>
              </TableRow>
            )}
            {currentDateRecord.map((row, idx) => (
              <TableRow key={idx} onClick={() => toggleDialog(row)}>
                <TableCell component="th" scope="row">
                  <Stack>
                    <Typography>{row.title}</Typography>
                    {row.description}
                  </Stack>
                </TableCell>
                <TableCell align="right" sx={{ minWidth: "6rem" }}>
                  {t("unit.distance.km", { distance: row.distance })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack justifyContent="flex-start" direction="row">
        <Button
          variant="contained"
          onClick={() => toggleDialog(viewDate as Date)}
        >
          {t("pages.planner.addRecord")}
        </Button>
      </Stack>
    </Stack>
  );
}
