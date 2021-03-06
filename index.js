/**
 * graph the movement of each axis
 */

import {
	connect
} from './circuit-playground';
import rotator from './p5/rotator';
import fish from './p5/fish';
import splatter from './splatter';
import totem from './p5/totem';
import boat from './p5/boat';
import duck from './p5/duck';

import {
	from,
	fromEvent
} from 'rxjs';
import {
	map,
	switchMap,
	catchError
} from 'rxjs/operators';
import {
	loadData
} from './accelerometer';

const connectButton = document.querySelector('#ble-connect');
const disconnectButton = document.querySelector('#ble-disconnect');
const demoButton = document.querySelector('#demo-connect');
const statusEl = document.querySelector('#ble-status');
const sketchSelector = document.querySelector('#sketch-select');

const logStatus = (text) => (statusEl.textContent = text);
const enableButton = (button) => button.removeAttribute('disabled');
const disableButton = (button) => button.setAttribute('disabled', true);

const SKETCHES = {
	duck: duck,
	boat: boat,
	totem: totem,
	rotator: rotator,
	splatter: splatter,
	fish: fish,
};

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
fromEvent(demoButton, 'click').subscribe(onStartDemo);

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

function onStartDemo() {
	(async function() {
		const data = await loadData('./accel.csv');
		SKETCHES[sketchSelector.value](data, true)
	})()
}

function sketchLoader(accelData$) {
	SKETCHES[sketchSelector.value](accelData$);
	sketchSelection.subscribe((sketchId) => {
		const canvas = document.querySelectorAll('canvas');
		const main = document.querySelector('main');
		if (canvas) {
			canvas.forEach((el) => el.remove());
		}
		if (main) {
			main.remove();
		}
		SKETCHES[sketchId](accelData$);
	});
}

function onError(error) {
	console.error(error);
}