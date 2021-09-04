import parse from 'csv-parse/lib/sync.js';

const BLE_SERVICES = {
    battery: {
        serviceId: 'battery_service',
        characteristicId: 'battery_level',
    },
    accelerometer: {
        serviceId: getFullId('0200'),
        characteristicId: getFullId('0201'),
    },
};

export async function loadData() {
    if ('bluetooth' in navigator) {
        console.log('bluetooth supported');
    } else {
        console.log('bluetooth not supported');
        return;
    }
    const connectButton = document.querySelector('#ble-connect');
    const device = await connect();
    connectButton.style.display = 'none';

    device.addEventListener('gattserverdisconnected', () => {
        console.log('disconnected from device');
        connectButton.style.display = 'inline-block';
    });

    const server = await device.gatt.connect();

    const accelService = await server
        .getPrimaryService(BLE_SERVICES.accelerometer.serviceId)
        .catch(handleError);

    const accelCharacteristic = await accelService
        .getCharacteristic(BLE_SERVICES.accelerometer.characteristicId)
        .catch(handleError);

    const accelData = {
        values: null,
        inProgress: false,
    };

    return {
        inProgress: false,
        values: null,
        start: async function () {
            setInterval(async () => {
                if (this.inProgress === true) return;
                this.inProgress = true;
                const value = await accelCharacteristic
                    .readValue()
                    .catch(handleError);

                this.values = {
                    x: await value.getFloat32(0, true),
                    y: await value.getFloat32(4, true),
                    z: await value.getFloat32(8, true),
                };

                this.inProgress = false;
            }, 100);
        },
    };
}

async function connect() {
    const filters = [{ namePrefix: 'CPlay' }];
    const services = Object.values(BLE_SERVICES).map(
        ({ serviceId }) => serviceId
    );

    const device = await navigator.bluetooth.requestDevice({
        filters: filters,
        optionalServices: services,
    });

    return device;
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
