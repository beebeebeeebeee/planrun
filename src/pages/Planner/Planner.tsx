import { ReactNode, useCallback } from "react";
import { CreateRecordDialogProvider, PlannerCalender } from "@/pages";
import { useStore } from "@/store";
import { RunRecord } from "@/entity";

export function Planner(): ReactNode {
  const { records, addRecord, updateRecord, deleteRecord } = useStore();

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

  return (
    <CreateRecordDialogProvider onSubmit={onSubmit} onRemove={onRemove}>
      <PlannerCalender records={records} updateOrdering={updateOrdering} />
    </CreateRecordDialogProvider>
  );
}
