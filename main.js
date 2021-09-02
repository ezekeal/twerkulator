/**
 * graph the movement of each axis
 */

import { loadData } from './accelerometer';
import splatter from './splatter';

loadData();

(async function () {
    setTimeout(await loadData());
    // const accelData = await loadData('accel.csv');
    // splatter(accelData);
})();
