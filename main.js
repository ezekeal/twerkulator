/**
 * graph the movement of each axis
 */
import { loadData } from './accelerometer';
import fish from './p5/fish';

const connectButton = document.querySelector('#ble-connect');
connectButton.addEventListener('click', async function () {
    const accelData = await loadData();
    fish(accelData);
});
