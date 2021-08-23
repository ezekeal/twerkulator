import parse from 'csv-parse/lib/sync.js';

export async function loadData(filePath) {
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
        avg: (dimension) => accelData.reduce((sum, curr) => sum += curr[dimension], 0) / accelData.length,
        max: (dimension) => Math.max(...accelData.reduce((points, curr) => [...points, curr[dimension] ], [])),
        min: (dimension) => Math.min(...accelData.reduce((points, curr) => [...points, curr[dimension] ], [])),
        next: () => accelDataCopy.shift(),
    };
}
