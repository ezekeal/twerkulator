import {
  Observable,
  Subject,
  BehaviorSubject,
  fromEvent,
  Subscription,
} from "rxjs";
import { switchMap, tap, map, scan, catchError } from "rxjs/operators";
import { html, render } from "lit-html";

import { Connection } from "./types";
import { puckDeviceOptions, getPuckAccelerometerData } from "./puck";
import {
  circuitPlaygroundDeviceOptions,
  getCircuitPLaygroundAccelerometerData,
} from "./circuit-playground";

const bluetoothSupported: boolean = !!navigator.bluetooth;

const combinedDeviceFilters = {
  filters: [
    ...puckDeviceOptions.filters,
    ...circuitPlaygroundDeviceOptions.filters,
  ],
  optionalServices: [
    ...puckDeviceOptions.optionalServices,
    ...circuitPlaygroundDeviceOptions.optionalServices,
  ],
};

export const connectToDevice = async (): Promise<Connection> => {
  return {
    name: "",
    disconnected$: new Observable(),
    data$: new Observable(),
    close: () => {},
    write: () => {},
  };
};
