from djitellopy import tello
import KeyPressModule as kp
from time import sleep
import cv2

send = 0

kp.init()
me = tello.Tello()
me.connect()
print(me.get_battery())
me.streamon()

me.tello

def getKeyboardInput():
    lr, fb, ud, yv = 0, 0, 0, 0
    speed = 40
    if kp.getKey("LEFT"):
        lr = -speed
    elif kp.getKey("RIGHT"):
        lr = speed
    if kp.getKey("UP"):
        fb = speed
    elif kp.getKey("DOWN"):
        fb = -speed
    if kp.getKey("w"):
        ud = speed
    elif kp.getKey("s"):
        ud = -speed
    if kp.getKey("a"):
        yv = -speed
    elif kp.getKey("d"):
        yv = speed
    if kp.getKey("q"):
        me.land()
        sleep(3)
    if kp.getKey("e"):
        me.takeoff()
    if kp.getKey("y"):
        me.emergency()
    if kp.getKey("b"):
        me.send_command_without_return("stop")
    return [lr, fb, ud, yv]

while True:
    img = me.get_frame_read().frame
    img = cv2.resize(img, (360, 240))
    vals = getKeyboardInput()
    me.send_rc_control(vals[0], vals[1], vals[2], vals[3])
    sleep(0.05)
    cv2.imshow("subscribe", img)
    cv2.waitKey(1)
    #                  </>
