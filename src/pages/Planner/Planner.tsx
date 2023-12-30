import { ReactNode, useCallback, useMemo, useState } from "react";
import { Value } from "react-calendar/dist/cjs/shared/types";
import { Stack } from "@mui/material";
import {
  CreateRecordDialogProvider,
  PlannerCalender,
  PlannerDailyRecords,
} from "@/pages";
import { useStore } from "@/store";
import { RunRecord } from "@/entity";
import { dateUtil } from "@/utils";

export function Planner(): ReactNode {
  const { records, addRecord, updateRecord, deleteRecord } = useStore();

  const [viewDate, onViewDateChange] = useState<Value>(new Date());

  const onSubmit = useCallback((record: RunRecord) => {
    if (record.id === "") {
      addRecord(record);
    } else {
      updateRecord(record.id, record);
    }
  }, []);

  const onRemove = useCallback((id: string) => {
    deleteRecord(id);
  }, []);

  const updateOrdering = useCallback((newOrdering: RunRecord[]) => {
    newOrdering.forEach((record) => {
      deleteRecord(record.id);
      addRecord(record);
    });
  }, []);

  const getRecordsByDate = useCallback(
    (date: Date) =>
      records.filter(
        ({ date: rdate }) =>
          dateUtil.toDateString(rdate) === dateUtil.toDateString(date)
      ),
    [records]
  );

  const getInfoByDate = useCallback(
    (date: Date) =>
      getRecordsByDate(date).reduce<{
        distance: number;
        isRace: boolean;
      }>(
        (pv, cv) => ({
          distance: pv.distance + cv.distance,
          isRace: pv.isRace || (cv.isRace ?? false),
        }),
        {
          distance: 0,
          isRace: false,
        }
      ),
    [getRecordsByDate]
  );

  const currentDateRecord = useMemo(
    () => getRecordsByDate(viewDate as Date),
    [getRecordsByDate, viewDate]
  );

  return (
    <CreateRecordDialogProvider onSubmit={onSubmit} onRemove={onRemove}>
      <Stack spacing={2}>
        <PlannerCalender
          records={records}
          viewDate={viewDate}
          onViewDateChange={onViewDateChange}
          getInfoByDate={getInfoByDate}
        />
        <PlannerDailyRecords
          records={currentDateRecord}
          viewDate={viewDate}
          updateOrdering={updateOrdering}
        />
      </Stack>
    </CreateRecordDialogProvider>
  );
}
