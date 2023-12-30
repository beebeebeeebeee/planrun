import { WithUpdate } from "@/entity/abstract";

export type CreateRunRecord = {
  date: string;
  title: string;
  description: string;
  distance: number;
};

export type RunRecordProps = {
  date: string;
  title: string;
  description: string;
  distance: number;
};

export class RunRecord extends WithUpdate {
  id: string;

  date: string;

  title: string;

  description: string;

  distance: number;

  constructor(id: string, props: RunRecordProps) {
    super();

    const { date, title, description, distance } = props;
    this.id = id;
    this.date = date;
    this.title = title;
    this.description = description;
    this.distance = distance;
  }
}

export class RunRecordConverter {
  private static validate(record: any): boolean {
    return !(
      record == null ||
      typeof record !== "object" ||
      typeof record.id !== "string" ||
      typeof record.date !== "string" ||
      typeof record.title !== "string" ||
      typeof record.description !== "string" ||
      typeof record.distance !== "number"
    );
  }

  public static fromJSON(record: any): RunRecord | null {
    if (!this.validate(record)) {
      return null;
    }

    const { id, date, title, description, distance } = record;
    return new RunRecord(id, { date, title, description, distance });
  }
}
