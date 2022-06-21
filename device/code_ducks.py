from adafruit_circuitplayground import cp
import time
import random
import board
import audiocore
import audiopwmio
import digitalio

from digitalio import DigitalInOut
import neopixel_write

from adafruit_ble import BLERadio

from adafruit_ble_adafruit.adafruit_service import AdafruitServerAdvertisement

from adafruit_ble_adafruit.accelerometer_service import AccelerometerService
from adafruit_ble_adafruit.addressable_pixel_service import AddressablePixelService

accel_svc = AccelerometerService()
accel_svc.measurement_period = 100
accel_last_update = 0


ble = BLERadio()
# The Web Bluetooth dashboard identifies known boards by their
# advertised name, not by advertising manufacturer data.
ble.name = "CPlay"

# The Bluefruit Playground app looks in the manufacturer data
# in the advertisement. That data uses the USB PID as a unique ID.
# Adafruit Circuit Playground Bluefruit USB PID:
# Arduino: 0x8045,  CircuitPython: 0x8046, app supports either
adv = AdafruitServerAdvertisement()
adv.pid = 0x8046

#https://docs.circuitpython.org/en/latest/shared-bindings/audiopwmio/index.html
#https://learn.adafruit.com/make-it-talk/circuitpython

thresh = 2  #change in acceleration threshold
x0, y0, z0 = 0, 0, 0  #previous acceleration value
duck = ["duck1.wav", "duck2.wav", "duck3.wav"]  #duck sounds on CIRCUITPY

lasttime = time.monotonic() #gets current time
timer = 10  #quack ever __ seconds
last = 0   #records last quack time

RED = (255, 0, 0)
ORANGE = (255, 51, 0)
YELLOW = (255, 153, 0)
GREEN = (0, 255, 0)
CYAN = (0, 255, 255)
BLUE = (0, 0, 255)
PURPLE = (153, 0, 255)
rainbow = (RED, ORANGE, YELLOW, GREEN, CYAN, BLUE, PURPLE)

data = open("duck1.wav", "rb")
wav = audiocore.WaveFile(data)
a = audiopwmio.PWMAudioOut(board.SPEAKER)
quacking = 0


def sound():
	i = random.randint(0, len(duck) - 1)  #choose random duck sound
	data = open(duck[i], "rb")            #load duck sound
	wav = audiocore.WaveFile(data)        #load duck sound
	while not a.playing:
		a.play(wav)                       #play audio if audio isn't already playing
		quacking = 0                      #quacking used to turn off/on sparkle lights
	while a.playing:
		quacking = 1

def rainbowMode():
	pix = random.randint(0, 9)                  #choose 1 of 10 neopixels
	color = random.randint(0, len(rainbow) - 1) #choose random color from rainbow
	cp.pixels[pix] = rainbow[color]             #display color
	cp.pixels.fill((0, 0, 0))                   #clear color

def quack():
	if quacking == 0:                              #sparkle only when there's no quacking sound active
		pix = random.randint(0, 9)                  #choose 1 of 10 neopixels
		color = random.randint(0, len(rainbow) - 1) #choose random color from rainbow
		cp.pixels[pix] = rainbow[color]             #display color
		cp.pixels.fill((0, 0, 0))                   #clear color

		## Check for sudden acceleration
		x1, y1, z1 = cp.acceleration
		if x1 - x0 > thresh or y1 - y0 > thresh or z1 - z0 > thresh:
			cp.pixels.fill((255, 100, 0))           #shine red
			sound()                               #play sound
		x0, y0, z0 = cp.acceleration              #set last accel to current accel
		if time.monotonic() - lasttime > timer:
			cp.pixels.fill((0, 0, 255))          #shine blue
			sound()                              #play sound
			lasttime = time.monotonic()          #restart timer count down
while True:

	# Advertise when not connected.
	ble.start_advertising(adv)
	while not ble.connected:
		## Sparkle 1 of 10 neopixels with random colors
		if quacking == 0:                              #sparkle only when there's no quacking sound active
			rainbowMode()
			## Check for sudden acceleration
			x1, y1, z1 = cp.acceleration
			if x1 - x0 > thresh or y1 - y0 > thresh or z1 - z0 > thresh:
				cp.pixels.fill((255, 20, 0))           #shine orange
				sound()                               #play sound
			x0, y0, z0 = cp.acceleration              #set last accel to current accel
			if time.monotonic() - lasttime > timer:
				cp.pixels.fill((100, 255, 0))          #shine green
				sound()                              #play sound
				lasttime = time.monotonic()          #restart timer count down

	ble.stop_advertising()

	while ble.connected:
		now_msecs = time.monotonic_ns() // 1000000  # pylint: disable=no-member

		if now_msecs - accel_last_update >= accel_svc.measurement_period:
			accel_svc.acceleration = cp.acceleration
			accel_last_update = now_msecs

		if quacking == 0:
			rainbowMode()                            #sparkle only when there's no quacking sound active
			## Check for sudden acceleration
			x1, y1, z1 = cp.acceleration
			if x1 - x0 > thresh or y1 - y0 > thresh or z1 - z0 > thresh:
				cp.pixels.fill((255, 0, 0))           #shine red
				sound()                               #play sound
			x0, y0, z0 = cp.acceleration              #set last accel to current accel
			if time.monotonic() - lasttime > timer:
				cp.pixels.fill((0, 50, 255))          #shine blue
				sound()                              #play sound
				lasttime = time.monotonic()          #restart timer count down
