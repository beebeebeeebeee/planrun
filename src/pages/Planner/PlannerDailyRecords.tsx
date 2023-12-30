import {
  Box,
  Button,
  Card as MuiCard,
  CardContent,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { ReactNode, useCallback } from "react";
import { Value } from "react-calendar/dist/cjs/shared/types";
import {
  SortableContainer,
  SortableElement,
  SortEnd,
} from "react-sortable-hoc";
import { useTranslation } from "react-i18next";
import { dateUtil } from "@/utils";
import { RunRecord } from "@/entity";
import { useCreateRecordDialog } from "@/pages";

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

export type PlannerDailyRecordsProps = {
  records: RunRecord[];
  viewDate: Value;
  updateOrdering: (newOrdering: RunRecord[]) => void;
};

export function PlannerDailyRecords(
  props: PlannerDailyRecordsProps
): ReactNode {
  const { records, viewDate, updateOrdering } = props;

  const { toggleDialog } = useCreateRecordDialog()!;
  const { t } = useTranslation();

  const onSortEnd = useCallback(
    (sort: SortEnd): void => {
      if (sort.newIndex === sort.oldIndex) return;

      const newRecords = [...records];
      const [removed] = newRecords.splice(sort.oldIndex, 1);
      newRecords.splice(sort.newIndex, 0, removed);
      updateOrdering(newRecords);
    },
    [records]
  );

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Typography>
          {dateUtil.toDateString(viewDate as Date)}{" "}
          {t(
            `unit.weekday.${
              (viewDate as Date).getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6
            }`
          )}
        </Typography>
      </Stack>

      {records.length === 0 ? (
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
            {records.map((row, idx) => {
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
                  {records.length > 1 ? (
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
    </>
  );
}
