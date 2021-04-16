#!coding:utf-8
from pi_driver import D51Driver
driver = D51Driver()


def stopMotors():
    for i in range(5):
        driver.motor_set_speed(i+1, 0)


if __name__ == '__main__':
    stopMotors()
