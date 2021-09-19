/**
 * graph the movement of each axis
 */

import { connect } from './circuit-playground';
import rotator from './p5/rotator';
import fish from './p5/fish';
import splatter from './splatter';
import { from, fromEvent } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

const connectButton = document.querySelector('#ble-connect');
const disconnectButton = document.querySelector('#ble-disconnect');
const statusEl = document.querySelector('#ble-status');
const sketchSelector = document.querySelector('#sketch-select');

const logStatus = (text) => (statusEl.textContent = text);
const enableButton = (button) => button.removeAttribute('disabled');
const disableButton = (button) => button.setAttribute('disabled', true);

const sketchSelection = fromEvent(sketchSelector, 'change').pipe(
    map((event) => event.target.value)
);

sketchSelector.addEventListener('change', (e) =>
    console.log('selection changed', e.target.value)
);

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
    sketchLoader(cpDevice.accelerometer$);
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

function sketchLoader(accelData$) {
    const SKETCHES = {
        rotator: rotator,
        splatter: splatter,
        fish: fish,
    };

    SKETCHES[sketchSelector.value](accelData$);
    sketchSelection.subscribe((sketchId) => {
        document.querySelector('canvas')?.remove();
        document.querySelector('main')?.remove();
        SKETCHES[sketchId](accelData$);
    });
}

function onError(error) {
    console.error(error);
}
