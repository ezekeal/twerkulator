// can be loaded to flash or ram at https://www.espruino.com/ide/

var accelOn = false;
var bluetoothLedInterval;

function blinkLED(led) {
    led.write(1);
    setTimeout(() => led.write(0), 10);
}

function blinkBlueLED() {
    blinkLED(LED3);
}

function blinkGreenLED() {
    blinkLED(LED2);
}

function blinkRedLED() {
    blinkLED(LED1);
}

function startAccel() {
    blinkGreenLED();
    bluetoothLedInterval = setInterval(() => {
        if (Puck.getBatteryPercentage() < 10) {
            blinkRedLED();
        } else {
            blinkBlueLED();
        }
    }, 5000);
    Puck.accelOn(52);
}

function stopAccel() {
    Puck.accelOff();
    clearInterval(bluetoothLedInterval);
}

Puck.on('accel', function (a) {
    Bluetooth.print(JSON.stringify(a));
});

setWatch(
    function () {
        if (accelOn) {
            stopAccel();
        } else {
            startAccel();
        }
        accelOn = !accelOn;
    },
    BTN,
    { edge: 'rising', debounce: 50, repeat: true }
);
