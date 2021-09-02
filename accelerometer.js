import parse from 'csv-parse/lib/sync.js';

const BLE_SERVICES = {
    battery: {
        serviceId: 'battery_service',
    },
    accelerometer: {
        serviceId: '0200',
    },
    gyroscope: {
        serviceId: '0400',
    },
};

export async function loadData() {
    if ('bluetooth' in navigator) {
        // handle not supported
        console.log('bluetooth supported');
    } else {
        console.log('bluetooth not supported');
        return;
    }
    const device = await connect();
}

async function connect() {
    const filters = [{ namePrefix: 'CPlay' }];
    const services = Object.values(BLE_SERVICES).map((service) =>
        getFullId(service.serviceId)
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
