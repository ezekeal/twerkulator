/**
 * graph the movement of each axis
 */
import { loadData } from './accelerometer';
import basicP5 from './basicP5';

const connectButton = document.querySelector('#ble-connect');
connectButton.addEventListener('click', async function () {
    const accelData = await loadData();
    basicP5(accelData);
});
