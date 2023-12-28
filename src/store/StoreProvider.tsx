import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { v4 as uuidV4 } from "uuid";
import { CreateRunRecord, RunRecord } from "@/entity";
import { Store } from "@/store";

export type StoreValue = {
  records: RunRecord[];
  addRecord: (payload: CreateRunRecord) => void;
  deleteRecord: (id: string) => void;
  updateRecord: (id: string, payload: RunRecord) => void;
  exportRecords: () => void;
  importRecords: () => void;
};

export const StoreContext = createContext<StoreValue | undefined>(undefined);

const store = new Store();

export function StoreProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[] | boolean | undefined;
}): JSX.Element {
  const [records, setRecords] = useState<RunRecord[]>([]);

  const addRecord = useCallback((payload: CreateRunRecord) => {
    const id = uuidV4();
    const record = new RunRecord(id, payload);
    setRecords((r) => {
      const data = [...r, record];
      store.set(data);
      return data;
    });
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords((r) => {
      const data = r.filter((record) => record.id !== id);
      store.set(data);
      return data;
    });
  }, []);

  const updateRecord = useCallback((id: string, payload: RunRecord) => {
    setRecords((r) => {
      const data = r.map((record) => (record.id === id ? payload : record));
      store.set(data);
      return data;
    });
  }, []);

  const exportRecords = useCallback(() => {
    store.export();
  }, []);

  const importRecords = useCallback(async () => {
    await store.import();
    const data = store.get();
    setRecords(data);
  }, []);

  useEffect(() => {
    const data = store.get();
    setRecords(data);
  }, []);

  const value: StoreValue = useMemo(
    () => ({
      records,
      addRecord,
      deleteRecord,
      updateRecord,
      exportRecords,
      importRecords,
    }),
    [
      records,
      addRecord,
      deleteRecord,
      updateRecord,
      exportRecords,
      importRecords,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext);

  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }

  return context;
}
