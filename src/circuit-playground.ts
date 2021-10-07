import { BehaviorSubject, fromEvent, Observable, ReplaySubject } from "rxjs";
import { map, takeWhile } from "rxjs/operators";
import { Connection, AccelerometerFrame } from "./types";

const accelerometerServiceId = "adaf0200-c332-42a8-93bd-25e905756cb8";

export const circuitPlaygroundDeviceOptions = {
  filters: [{ namePrefix: "CPlay" }],
  optionalServices: [accelerometerServiceId],
};

export async function getCircuitPLaygroundAccelerometerData(
  characteristics: BluetoothRemoteGATTCharacteristic[],
  measurementPeriod = 500
): Promise<BehaviorSubject<AccelerometerFrame>> {
  const [accelerometerCharacteristic, measurementPeriodCharactersitic] = [
    "0201",
    "0001",
  ].map((serviceId) =>
    characteristics.find(({ uuid }) => uuid.startsWith(`adaf${serviceId}`))
  );

  const periodDataView = new DataView(new ArrayBuffer(4));
  periodDataView.setInt32(0, measurementPeriod, true);
  await measurementPeriodCharactersitic.writeValue(periodDataView.buffer);

  await accelerometerCharacteristic.startNotifications();

  const accelerometer$: BehaviorSubject<AccelerometerFrame> =
    new BehaviorSubject({ x: 0, y: 0, z: 0 });

  fromEvent(accelerometerCharacteristic, "characteristicvaluechanged")
    .pipe(
      takeWhile((_) => !accelerometer$.closed),
      map((event) => {
        const value = (<BluetoothRemoteGATTCharacteristic>event.target).value;
        return {
          x: value.getFloat32(0, true),
          y: value.getFloat32(4, true),
          z: value.getFloat32(8, true),
        };
      })
    )
    .subscribe((value) => accelerometer$.next(value));

  return accelerometer$;
}
