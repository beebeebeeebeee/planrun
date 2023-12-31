import { RunRecord, RunRecordConverter } from "@/entity";

const LOCAL_STORAGE_KEY = "RUNNING_RECORDS";

export class Store {
  public get(): RunRecord[] {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return (JSON.parse(data) as RunRecord[]).map(
        (record) =>
          new RunRecord(record.id, {
            ...record,
          })
      );
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
    return [];
  }

  public set(records: RunRecord[]): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  }

  public export(): void {
    const data = this.get();
    const blob = new Blob([JSON.stringify(data)], {
      type: "text/plain;charset=utf-8",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `running-records-${new Date().toISOString()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  public import(): Promise<void> {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json,.txt";
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) {
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const content = reader.result;
          if (!content) {
            return;
          }

          const data: unknown = JSON.parse(content.toString());

          this.set(
            Array.isArray(data)
              ? (data
                  .map((record: any) => RunRecordConverter.fromJSON(record))
                  .filter((record) => record != null) as RunRecord[])
              : []
          );
          resolve();
        };
        reader.readAsText(file);
      };
      input.click();
    });
  }
}
