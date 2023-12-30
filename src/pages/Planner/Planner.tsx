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

  const getDistanceByDate = useCallback(
    (date: Date) =>
      getRecordsByDate(date).reduce((pv, cv) => pv + cv.distance, 0),
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
          getDistanceByDate={getDistanceByDate}
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
