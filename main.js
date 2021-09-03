/**
 * graph the movement of each axis
 */

import { loadData } from './accelerometer';
import splatter from './splatter';

const connectButton = document.querySelector('#ble-connect');
connectButton.addEventListener('click', async function () {
    const accelData = await loadData();
    splatter(accelData);
});
