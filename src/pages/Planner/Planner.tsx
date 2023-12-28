import { useCallback } from "react";
import { CreateRecordDialogProvider, PlannerCalender } from "@/pages";
import { useStore } from "@/store";
import { RunRecord } from "@/entity";

export function Planner(): JSX.Element {
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

  return (
    <CreateRecordDialogProvider onSubmit={onSubmit} onRemove={onRemove}>
      <PlannerCalender records={records} />
    </CreateRecordDialogProvider>
  );
}