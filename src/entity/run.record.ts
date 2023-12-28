import { WithUpdate } from "@/entity/abstract";

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

export type CreateRunRecord = {
  date: string;
  title: string;
  description: string;
  distance: number;
};
