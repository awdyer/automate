# Imports
import webiopi, json, datetime
from time import strftime

# Retrieve GPIO lib
GPIO = webiopi.GPIO

# f = open('/home/pi/automate/scripts/logs/autoTimes.log', 'a+')

# enabled,on,off times for each pin
GPIO_pins = [2, 3, 4, 7, 8, 9, 10, 11, 14, 15, 17, 18, 22, 23, 24, 25, 27];
autoTimes = {}; # format: {'2': [enabled, timeOn, timeOff]}
for i in range(0, len(GPIO_pins)):
    autoTimes[str(GPIO_pins[i])] = ['false','07:00','23:00']


# Called by webiopi at startup
def setup():
    # current time
    now = datetime.datetime.now().time()

    # check whether pins should be on or off and set accordingly
    for p in autoTimes:
        pin = autoTimes[p]
        if pin[0] == 'true':
            timeOn = now.replace(hour=int(pin[1].split(':')[0]), minute=int(pin[1].split(':')[1]))
            timeOff = now.replace(hour=int(pin[2].split(':')[0]), minute=int(pin[2].split(':')[1]))
            if ((now >= timeOn) and (now < timeOff)):
                GPIO.digitalWrite(int(p), GPIO.HIGH)


# loop function is repeatedly called by WebIOPi 
def loop():
    # retrieve current datetime
    now = datetime.datetime.now().time()

    # check whether pins should be on or off and set accordingly
    for p in autoTimes:
        pin = autoTimes[p]
        if pin[0] == 'true':
            timeOn = now.replace(hour=int(pin[1].split(':')[0]), minute=int(pin[1].split(':')[1]))
            timeOff = now.replace(hour=int(pin[2].split(':')[0]), minute=int(pin[2].split(':')[1]))
            if (now == timeOn):
                GPIO.digitalWrite(int(p), GPIO.HIGH)
            if (now == timeOff):
                GPIO.digitalWrite(int(p), GPIO.LOW)


    webiopi.sleep(10)


@webiopi.macro
def getAutoTimes():
    return json.dumps(autoTimes)

@webiopi.macro
def setAutoTime(pin, enabled, timeOn, timeOff):
    global autoTimes
    if pin not in autoTimes:
        return -1
    autoTimes[pin] = [enabled, timeOn, timeOff];
    return getAutoTimes()