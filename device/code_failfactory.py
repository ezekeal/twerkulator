#fast LED - Ting - tophat matrix stuff
import time
import board
import neopixel
# from rainbowio import colorwheel

pixel = neopixel.NeoPixel(board.D9, 25, pixel_order=neopixel.RGBW)
# pixel[0] = (30, 0, 20, 10)
# pixel[1] = (30, 10, 20, 10)
# pixel[2] = (30, 20, 20, 10)
# pixel[8] = (30, 0, 20, 10)
# pixel[9] = (30, 10, 20, 10)
# pixel[12] = (30, 20, 20, 10)
for i in range(18):
	pixel[i] = (30, 20, 20, 20)
    # time.sleep(1)
	# pixel[i] = (30, 30, 20, 10)

    # pixels.show()
	# time.sleep(0.5)
# pixel.fill(30, 0, 20, 10)
#         pixels.show()


#
# # Circuit Playground NeoPixel
# import board
# from rainbowio import colorwheel
# import neopixel
#
# pixels = neopixel.NeoPixel(board.D9, 10, brightness=0.2, auto_write=False)
#
# # choose which demos to play
# # 1 means play, 0 means don't!
# color_chase_demo = 1
# flash_demo = 0
# rainbow_demo = 0
# rainbow_cycle_demo = 0
#
#
# def color_chase(color, wait):

#
#
# def rainbow_cycle(wait):
#     for j in range(255):
#         for i in range(10):
#             rc_index = (i * 256 // 10) + j * 5
#             pixels[i] = colorwheel(rc_index & 255)
#         pixels.show()
#         time.sleep(wait)
#
#
# def rainbow(wait):
#     for j in range(255):
#         for i in range(len(pixels)):
#             idx = int(i + j)
#             pixels[i] = colorwheel(idx & 255)
#         pixels.show()
#         time.sleep(wait)
#
#
# RED = (255, 0, 0)
# YELLOW = (255, 150, 0)
# GREEN = (0, 255, 0)
# CYAN = (0, 255, 255)
# BLUE = (0, 0, 255)
# PURPLE = (180, 0, 255)
# WHITE = (255, 255, 255)
# OFF = (0, 0, 0)
#
# while True:
#     if color_chase_demo:
#         color_chase(RED, 0.1)  # Increase the number to slow down the color chase
#         color_chase(YELLOW, 0.1)
#         color_chase(GREEN, 0.1)
#         color_chase(CYAN, 0.1)
#         color_chase(BLUE, 0.1)
#         color_chase(PURPLE, 0.1)
#         color_chase(OFF, 0.1)
#
#     if flash_demo:
#         pixels.fill(RED)
#         pixels.show()
#         # Increase or decrease to change the speed of the solid color change.
#         time.sleep(1)
#         pixels.fill(GREEN)
#         pixels.show()
#         time.sleep(1)
#         pixels.fill(BLUE)
#         pixels.show()
#         time.sleep(1)
#         pixels.fill(WHITE)
#         pixels.show()
#         time.sleep(1)
#
#     if rainbow_cycle_demo:
#         rainbow_cycle(0.05)  # Increase the number to slow down the rainbow.
#
#     if rainbow_demo:
#         rainbow(0.05)  # Increase the number to slow down the rainbow.
