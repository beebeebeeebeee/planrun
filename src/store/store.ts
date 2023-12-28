import { RunRecord } from "@/entity";

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

  public import(): void {
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

        const data = JSON.parse(content.toString());
        this.set(data);
      };
      reader.readAsText(file);
    };
    input.click();
  }
}
