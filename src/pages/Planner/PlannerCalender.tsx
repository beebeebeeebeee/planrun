import { ReactNode, useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card as MuiCard,
  Divider,
  Grid,
  Stack,
  styled,
  Typography,
  CardContent,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { OnArgs } from "react-calendar/src/shared/types";
import {
  SortableContainer,
  SortableElement,
  SortEnd,
} from "react-sortable-hoc";
import { DistanceCalendar } from "@/components";
import { dateUtil } from "@/utils";
import { useCreateRecordDialog } from "@/pages";
import { RunRecord } from "@/entity";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

type PlannerCalenderProp = {
  records: RunRecord[];
  updateOrdering: (newOrdering: RunRecord[]) => void;
};

const SortableHead = SortableContainer<{ children: ReactNode }>(
  ({ children }: { children: ReactNode }) => {
    return children;
  }
);

const SortableCell = SortableElement<{ children: ReactNode }>(
  ({ children }: { children: ReactNode }) => {
    return children;
  }
);

const Card = styled(MuiCard)({ p: 0, borderRadius: 1 });

export function PlannerCalender(props: PlannerCalenderProp): ReactNode {
  const { records, updateOrdering } = props;

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

  const onSortEnd = useCallback(
    (sort: SortEnd): void => {
      console.log(sort.newIndex, sort.oldIndex);
      if (sort.newIndex === sort.oldIndex) return;

      const newRecords = [...currentDateRecord];
      const [removed] = newRecords.splice(sort.oldIndex, 1);
      newRecords.splice(sort.newIndex, 0, removed);
      updateOrdering(newRecords);
    },
    [currentDateRecord]
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

      {currentDateRecord.length === 0 ? (
        <Card>
          <CardContent
            sx={{ textAlign: "center", p: 2, "&:last-child": { p: 2, pb: 2 } }}
          >
            {t("pages.planner.noRecords")}
          </CardContent>
        </Card>
      ) : (
        <SortableHead axis="y" onSortEnd={onSortEnd}>
          <Stack spacing={1}>
            {currentDateRecord.map((row, idx) => {
              const card = (
                <Card>
                  <CardContent sx={{ p: 2, "&:last-child": { p: 2, pb: 2 } }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack>
                        <Typography>{row.title}</Typography>
                        {row.description}
                      </Stack>
                      <Typography>
                        {t("unit.distance.km", { distance: row.distance })}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              );

              return (
                <Box onClick={() => toggleDialog(row)} key={idx}>
                  {currentDateRecord.length > 1 ? (
                    <SortableCell index={idx}>{card}</SortableCell>
                  ) : (
                    card
                  )}
                </Box>
              );
            })}
          </Stack>
        </SortableHead>
      )}
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
