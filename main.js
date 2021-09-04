/**
 * graph the movement of each axis
 */

import {
	loadData
} from './accelerometer';
import basicP5 from './basicP5.js';

(async function() {
	const accelData = await loadData('accel.csv');
	basicP5(accelData);
})();