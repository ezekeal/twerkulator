/**
 * graph the movement of each axis
 */

import { loadData } from './accelerometer';
import splatter from './splatter';

(async function () {
    const accelData = await loadData('accel.csv');
    splatter(accelData);
})();
