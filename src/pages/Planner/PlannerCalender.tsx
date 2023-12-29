import { ReactNode, useCallback, useState } from "react";
import {
  Button,
  Divider,
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

  const startOfWeek = dateUtil.getStartOfWeek(viewDate as Date);
  const endOfWeek = dateUtil.getEndOfWeek(viewDate as Date);

  const currentDateRecord = records.filter(
    ({ date }) =>
      dateUtil.toDateString(date) === dateUtil.toDateString(viewDate as Date)
  );
  const currentDateDistance = currentDateRecord.reduce(
    (pv, cv) => pv + cv.distance,
    0
  );

  const currentWeekDistance = records
    .filter(({ date }) =>
      dateUtil.isBetween(new Date(`${date} 00:00:00`), startOfWeek, endOfWeek)
    )
    .reduce((pv, cv) => pv + cv.distance, 0);

  const tileDistance = useCallback(
    (tileDate: Date) =>
      records
        .filter(
          ({ date }) =>
            dateUtil.toDateString(date) === dateUtil.toDateString(tileDate)
        )
        .reduce((pv, cv) => pv + cv.distance, 0),
    [records]
  );

  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography>
            {t("pages.planner.week", {
              week: dateUtil.getWeekNumber(startOfWeek),
            })}
          </Typography>
          <Typography>
            {dateUtil.toDateString(startOfWeek)} -{" "}
            {dateUtil.toDateString(endOfWeek)}
          </Typography>
          <Typography>
            {t("unit.distance.km", { distance: currentWeekDistance })}
          </Typography>
        </Stack>
        <DistanceCalendar
          viewDate={viewDate}
          onViewDateChange={onViewDateChange}
          tileDistance={tileDistance}
        />
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
