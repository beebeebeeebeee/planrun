import { WithUpdate } from "@/entity/abstract";

export type CreateRunRecord = {
  date: string;
  title: string;
  description: string;
  distance: number;
  isRace?: boolean;
  raceTime?: string;
};

export type RunRecordProps = {
  date: string;
  title: string;
  description: string;
  distance: number;
  isRace?: boolean;
  raceTime?: string;
};

export class RunRecord extends WithUpdate {
  id: string;

  date: string;

  title: string;

  description: string;

  distance: number;

  isRace?: boolean;

  raceTime?: string;

  constructor(id: string, props: RunRecordProps) {
    super();

    const { date, title, description, distance, isRace, raceTime } = props;
    this.id = id;
    this.date = date;
    this.title = title;
    this.description = description;
    this.distance = distance;
    this.isRace = isRace;
    this.raceTime = raceTime;
  }

  public get isUpcoming(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(`${this.date} 00:00:00`);
    return date > today;
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
      typeof record.distance !== "number" ||
      (record.isRace != null && typeof record.isRace !== "boolean") ||
      (record.raceTime != null && typeof record.raceTime !== "string")
    );
  }

  public static fromJSON(record: unknown | RunRecord): RunRecord | null {
    if (!this.validate(record)) {
      return null;
    }

    const { id, date, title, description, distance, isRace, raceTime } =
      record as RunRecord;
    return new RunRecord(id, {
      date,
      title,
      description,
      distance,
      isRace,
      raceTime,
    });
  }
}
