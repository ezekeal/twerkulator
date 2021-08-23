/**
 * graph the movement of each axis
 */

 import { loadData } from './accelerometer';

 (async function() {
    const data = await loadData('accel.csv');

    ['x', 'y', 'z'].forEach(dimension => {
        console.log(`avg ${dimension}: ${data.avg(dimension)}`);
        console.log(`min ${dimension}: ${data.min(dimension)}`);
        console.log(`max ${dimension}: ${data.max(dimension)}`);
    })
 })()