# """CircuitPython Essentials NeoPixel example"""
import time
import board

from adafruit_circuitplayground import cp

import neopixel

# from adafruit_led_animation.animation.chase import Chase
# from adafruit_led_animation.animation.rainbowcomet import RainbowComet
# from adafruit_led_animation.color import WHITE

from adafruit_ble import BLERadio
from adafruit_ble_adafruit.adafruit_service import AdafruitServerAdvertisement
from adafruit_ble_adafruit.accelerometer_service import AccelerometerService

# import displayio
# import terminalio
# import adafruit_imageload
# from adafruit_display_text import label
# from adafruit_gizmo import tft_gizmo


class Strip:
    def __init__(self, pixels, color, brightness):
        self.pixels = pixels
        self.color = color
        self.brightness = brightness


## Lights
class Strip:
    def __init__(self, pixels, color, brightness, increasing):
        self.pixels = pixels
        self.color = color
        self.brightness = brightness
        self.increasing = increasing


num_pixels_lg = 35
num_pixels_small = 19
red = (255, 0, 0)
orange = (255, 165, 0)
yellow = (255, 255, 0)
green = (0, 255, 0)
blue = (0, 0, 255)
purple = (128, 0, 128)

colors = [red, orange, yellow, green, blue, purple]

strips = [
    Strip(neopixel.NeoPixel(board.A1, num_pixels_lg, brightness=0.1), 0, 0.1, True),
    Strip(neopixel.NeoPixel(board.A2, num_pixels_lg, brightness=0.1), 1, 0.1, False),
    Strip(neopixel.NeoPixel(board.A3, num_pixels_lg, brightness=0.1), 2, 0.1, True),
    Strip(neopixel.NeoPixel(board.A4, num_pixels_small, brightness=0.1), 3, 0.1, False),
]

# chase = Chase(strips[1], speed=0.1, color=WHITE, size=3, spacing=6)
# rainbow_comet = RainbowComet(strips[0], speed=0.1, tail_length=7, bounce=False)
# rainbow_comet2 = RainbowComet(strips[1], speed=0.1, tail_length=7, bounce=False)
# pixels = neopixel.NeoPixel(board.A1, num_pixels, brightness=0.1, auto_write=False)


def animate():
    for i in range(len(strips)):
        strip = strips[i]
        if strip.increasing:
            if strip.brightness < 1.0:
                strip.brightness = strip.brightness + 0.1
            else:
                strip.increasing = False
        else:
            if strip.brightness > 0:
                strip.brightness = strip.brightness - 0.1
            else:
                strip.increasing = True
                if strip.color < (len(colors) - 1):
                    strip.color = strip.color + 1
                else:
                    strip.color = 0
        strip.pixels.fill(colors[strip.color])
        strip.pixels.brightness = strip.brightness


## Accelerometer
accel_svc = AccelerometerService()
accel_svc.measurement_period = 100
accel_last_update = 0


## Bluetooth
ble = BLERadio()
ble.name = "CPlay"
adv = AdafruitServerAdvertisement()
adv.pid = 0x8046


## Display
# image_update_rate = 1000
# # Create the TFT Gizmo display
# display = tft_gizmo.TFT_Gizmo()

# group = displayio.Group()

# bitmap_file = open("/ai-sprite.bmp", "rb")
# bitmap = displayio.OnDiskBitmap(bitmap_file)

# ai_grid = displayio.TileGrid(
#     bitmap,
#     pixel_shader=bitmap.pixel_shader,
#     width=1,
#     height=1,
#     tile_height=240,
#     tile_width=240,
#     default_tile=10,
#     x=0,
#     y=0,
# )

# group.append(ai_grid)

# display.show(group)

# total_frames = 5
last_update = 0
# current_frame = 0


while True:
    # strips[0][0] = (255, 0, 0)
    # rainbow_comet.animate()
    # rainbow_comet2.animate()
    if (last_update + 0.07) < time.monotonic():
        animate()
        last_update = time.monotonic()
    #     ai_grid[0] = current_frame
    #     current_frame += 1
    #     last_update = time.monotonic()
    #     if current_frame > (total_frames - 1):
    #       current_frame = 0

    if ble.connected and ble.advertising:
        ble.stop_advertising()
    elif not ble.connected and not ble.advertising:
        ble.start_advertising(adv)

    if ble.connected:
        now_msecs = time.monotonic_ns() // 1000000  # pylint: disable=no-member
        if now_msecs - accel_last_update >= accel_svc.measurement_period:
            accel_svc.acceleration = cp.acceleration
            accel_last_update = now_msecs
