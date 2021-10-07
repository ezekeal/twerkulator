import { fromEvent, BehaviorSubject } from "rxjs";
import { tap, map, pairwise, filter, takeWhile } from "rxjs/operators";

import { arrayBufferToString } from "./utils";
import { AccelerometerFrame } from "./types";

const NORDIC_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const NORDIC_TX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const NORDIC_RX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

export const puckDeviceOptions = {
  filters: [{ namePrefix: "Puck.js" }, { services: [NORDIC_SERVICE] }],
  optionalServices: [NORDIC_SERVICE],
};

export async function getPuckAccelerometerData(
  characteristics: BluetoothRemoteGATTCharacteristic[],
  measurementPeriod = 500
): Promise<BehaviorSubject<AccelerometerFrame>> {
  const [rxCharacteristic, txCharacteristic] = [NORDIC_RX, NORDIC_TX].map(
    (characteristicId) =>
      characteristics.find(({ uuid }) => uuid === characteristicId)
  );

  const accelerometer$: BehaviorSubject<AccelerometerFrame> =
    new BehaviorSubject({ x: 0, y: 0, z: 0 });

  const data$ = fromEvent(rxCharacteristic, "characteristicvaluechanged")
    .pipe(
      takeWhile(() => !accelerometer$.closed),
      map((event: Event) => {
        const characteristic =
          event.target as BluetoothRemoteGATTCharacteristic;
        return arrayBufferToString(characteristic.value.buffer);
      }),
      pairwise(),
      filter(
        ([str1, str2]) => str1[0] === "{" && str2[str2.length - 1] === "}"
      ),
      map(([str1, str2]) => str1 + str2),
      map((dataString) => {
        const accelData = JSON.parse(dataString);
        return accelData.acc;
      }),
      tap((val) => console.log("string", val))
    )
    .subscribe((value) => accelerometer$.next(value));

  await rxCharacteristic.startNotifications();

  return accelerometer$;
}

// export const connectToPuck = async (): Promise<Connection> => {
//   const device = await navigator.bluetooth.requestDevice(puckDeviceOptions);
//   const server = await device.gatt.connect();
//   const service = await server.getPrimaryService(NORDIC_SERVICE);
//   const rxCharacteristic = await service.getCharacteristic(NORDIC_RX);
//   const txCharacteristic = await service.getCharacteristic(NORDIC_TX);

//   const writeSubject: Subject<string> = new Subject();
//   const disconnectedSub: ReplaySubject<void> = new ReplaySubject();
//   fromEvent(device, "gattserverdisconnected").subscribe((_) =>
//     disconnectedSub.next()
//   );

//   const data$ = fromEvent(rxCharacteristic, "characteristicvaluechanged").pipe(
//     map((event: Event) => {
//       const characteristic = event.target as BluetoothRemoteGATTCharacteristic;
//       return arrayBufferToString(characteristic.value.buffer);
//     }),
//     pairwise(),
//     filter(([str1, str2]) => str1[0] === "{" && str2[str2.length - 1] === "}"),
//     map(([str1, str2]) => str1 + str2),
//     map((dataString) => {
//       const accelData = JSON.parse(dataString);
//       return accelData.acc;
//     })
//   );
//   await rxCharacteristic.startNotifications();

//   const writeSubscription = writeSubject
//     .asObservable()
//     .pipe(
//       switchMap((data) => {
//         //todo consider chunk size if there are issues
//         return txCharacteristic.writeValue(stringToArrayBuffer(data));
//       })
//     )
//     .subscribe();

//   return {
//     name: device.name,
//     disconnected$: disconnectedSub
//       .asObservable()
//       .pipe(tap((_) => writeSubscription.unsubscribe())),
//     acceleromaterData$: data$,
//     close: () => {
//       if (server.connected) {
//         server.disconnect();
//       }
//       disconnectedSub.next();
//     },
//   };
// };
