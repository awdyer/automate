# Imports
import webiopi

# Enable debug output
webiopi.setDebug()

# Retrieve GPIO lib
GPIO = webiopi.GPIO

# How often webiopi calls loop() in seconds
LOOP = 1

# GPIO pin mapping
SENSOR = 17
LED_SENSOR = 18

# sensor timer
timer = -1
timerValue = 5 # in seconds

# Called by WebIOPi at script loading
# def setup():
#     webiopi.debug("")


# Looped by WebIOPi
def loop():
    # define globals
    global timer

    # handle sensor
    sensor = GPIO.digitalRead(SENSOR)
    if (sensor == GPIO.HIGH):
        GPIO.digitalWrite(LED_SENSOR, GPIO.HIGH)
        timer = timerValue

    if (timer > 0):
        timer -= LOOP
    else:
        GPIO.digitalWrite(LED_SENSOR, GPIO.LOW)



    # Wait a bit before re-executing this loop
    webiopi.sleep(LOOP)