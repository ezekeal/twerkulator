/**
 * graph the movement of each axis
 */

const connectButton = document.querySelector('#ble-connect');
connectButton.addEventListener('click', async function () {
    const accelData = await loadData();
    basicP5(accelData);
});
