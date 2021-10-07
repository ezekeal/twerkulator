import { Observable } from "rxjs";

export type AccelerometerFrame = {
  x: number;
  y: number;
  z: number;
};

export type Connection = {
  name: string;
  disconnected$: Observable<boolean>;
  accelerometerData$: Observable<AccelerometerFrame>;
  disconnect: Function;
};
