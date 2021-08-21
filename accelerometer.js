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

    return {
        next: () => accelData.shift(),
    };
}
