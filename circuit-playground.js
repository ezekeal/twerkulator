import parse from 'csv-parse/lib/sync.js';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

// get all devices that start with CPlay and their accelerometer service
export async function connect() {
    if (!navigator.bluetooth) {
        throw 'bluetooth not supported';
    }
    const accelerometerServiceId = getFullId('0200');
    const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: 'CPlay' }],
        optionalServices: [accelerometerServiceId],
    });

    const server = await device.gatt.connect();
    const disconnected$ = new ReplaySubject();
    const accelerometer$ = await getAccelerometerService(server, 1);

    device.addEventListener('gattserverdisconnected', () => {
        disconnected$.next();
    });

    return {
        name: device.name,
        disconnect: () => {
            accelerometer$.complete();
            device.gatt.disconnect();
            disconnected$.next();
        },
        disconnected$,
        accelerometer$,
    };
}

async function getAccelerometerService(server, measurementPeriod = 500) {
    const accelerometerServiceId = getFullId('0200');
    const accelerometerCharacteristicId = getFullId('0201');

    const accelService = await server
        .getPrimaryService(accelerometerServiceId)
        .catch(handleError);

    const accelCharacteristic = await accelService
        .getCharacteristic(accelerometerCharacteristicId)
        .catch(handleError);

    setMesurementPeriod(accelService, measurementPeriod);

    await accelCharacteristic.startNotifications();
    const accelerometer$ = new BehaviorSubject();

    accelCharacteristic.addEventListener(
        'characteristicvaluechanged',
        async function (event) {
            const value = event.target.value;
            const accelValues = {
                x: await value.getFloat32(0, true),
                y: await value.getFloat32(4, true),
                z: await value.getFloat32(8, true),
            };
            accelerometer$.next(accelValues);
        }
    );

    return accelerometer$;
}

async function setMesurementPeriod(service, measurementPeriod) {
    const measurementPeriodId = getFullId('0001');
    const measurementPeriodRegister = await service
        .getCharacteristic(measurementPeriodId)
        .catch(handleError);
    const periodDataView = new DataView(new ArrayBuffer(4));

    periodDataView.setInt32(0, measurementPeriod, true);
    measurementPeriodRegister
        .writeValue(periodDataView.buffer)
        .catch(handleError)
        .then((_) =>
            console.info(
                `Changed measurement period for service ${service} to ${measurementPeriod}ms`
            )
        );
}

function getFullId(shortId) {
    if (shortId.length == 4) {
        return 'adaf' + shortId + '-c332-42a8-93bd-25e905756cb8';
    }
    return shortId;
}

function handleError(error) {
    console.error(error);
}

export async function loadFileData(filePath) {
    const accelFile = await fetch(filePath).then((response) => response.text());
    const accelData = parse(accelFile, {
        columns: true,
        cast: function (value, { header }) {
            if (header) {
                return value;
            }
            return parseFloat(value);
        },
    });

    const accelDataCopy = [...accelData];

    return {
        avg: (dimension) =>
            accelData.reduce((sum, curr) => (sum += curr[dimension]), 0) /
            accelData.length,
        max: (dimension) =>
            Math.max(
                ...accelData.reduce(
                    (points, curr) => [...points, curr[dimension]],
                    []
                )
            ),
        min: (dimension) =>
            Math.min(
                ...accelData.reduce(
                    (points, curr) => [...points, curr[dimension]],
                    []
                )
            ),
        next: () => accelDataCopy.shift(),
    };
}
