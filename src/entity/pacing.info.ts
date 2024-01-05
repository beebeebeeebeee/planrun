import { WithUpdate } from "@/entity/abstract";

export enum DistanceUnit {
  KILOMETERS = "kilometers",
  MILES = "miles",
}

export type PacingInfoProps = {
  unit: DistanceUnit;
  distance?: number;
  time?: number;
  pacing?: number;
};

export class PacingInfo extends WithUpdate {
  unit: DistanceUnit;

  distance?: number;

  time?: number;

  pacing?: number;

  constructor(props: PacingInfoProps) {
    super();
    const { unit, distance, time, pacing } = props;
    this.unit = unit;
    this.distance = distance;
    this.time = time;
    this.pacing = pacing;
  }
}
