/**
 * graph the movement of each axis
 */

import { connect } from './circuit-playground';
import splatter from './splatter';
import { from, fromEvent } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

const connectButton = document.querySelector('#ble-connect');
const disconnectButton = document.querySelector('#ble-disconnect');
const statusEl = document.querySelector('#ble-status');

const logStatus = (text) => (statusEl.textContent = text);
const enableButton = (button) => button.removeAttribute('disabled');
const disableButton = (button) => button.setAttribute('disabled', true);

let cpDevice = null;

fromEvent(connectButton, 'click')
    .pipe(switchMap(onConnecting), map(onConnected), catchError(onError))
    .subscribe();

fromEvent(disconnectButton, 'click').subscribe(onDisconnect);

function onConnecting() {
    disableButton(connectButton);
    logStatus('connecting to device...');
    return from(connect());
}

function onConnected(device) {
    enableButton(disconnectButton);
    logStatus(`connected to ${device.name}`);
    cpDevice = device;
    splatter(cpDevice.accelerometer$);
}

function onDisconnect() {
    disableButton(disconnectButton);
    if (cpDevice.disconnect) {
        cpDevice.disconnect();
    }
    logStatus(`disconnected from ${cpDevice.name}`);
    cpDevice = null;
    enableButton(connectButton);
}

function onError(error) {
    console.error(error);
}

// const connectButton = document.querySelector('#ble-connect');
// connectButton.addEventListener('click', async function () {
//     const accelData = await loadData();
//     splatter(accelData);
// });
