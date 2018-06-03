from contextlib import contextmanager
import math
import sys
from time import sleep

import pygame


FPS = 24
SCREEN_WIDTH = 1024
SCREEN_HEIGHT = 576
UPWARD, DOWNWARD, LEFTWARD, RIGHTWARD = range(4)


pygame.init()  # pylint: disable=no-member

screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
background = pygame.image.load('grass.png').convert()
clock = pygame.time.Clock()
font = pygame.font.SysFont('Arial', 50)


class MovableObject:
    instances = []

    def __init__(self, image_file, initial_position, initial_direction):
        self.image = pygame.image.load(image_file).convert_alpha()
        self.position = self.image.get_rect().move(initial_position)
        self.direction = initial_direction
        self.is_visible = False
        MovableObject.instances.append(self)

    def show(self):
        self.is_visible = True
        redraw_screen()

    def hide(self):
        self.is_visible = False
        redraw_screen()

    def move_forward(self, pixels):
        for _ in range(pixels):
            self.position = self.position.move(self._directional_coordinates())
            self._return_on_the_other_side()
            redraw_screen()

    def turn(self, angle):
        self.image = pygame.transform.rotate(self.image, angle)
        redraw_screen()
        # step = int(math.copysign(1, angle))
        # for _ in range(step, angle + 1, step):
        #     self.image = pygame.transform.rotate(self.image, step)
        #     redraw_screen()

    def _directional_coordinates(self):
        if self.direction == UPWARD:
            return (0, -1)
        elif self.direction == DOWNWARD:
            return (0, 1)
        elif self.direction == LEFTWARD:
            return (-1, 0)
        elif self.direction == RIGHTWARD:
            return (1, 0)
        assert False

    def _return_on_the_other_side(self):
        if self.position.left > SCREEN_WIDTH:
            self.position.right = 0
        elif self.position.right < 0:
            self.position.left = SCREEN_WIDTH
        elif self.position.top > SCREEN_HEIGHT:
            self.position.bottom = 0
        elif self.position.bottom < 0:
            self.position.top = SCREEN_HEIGHT


roach = MovableObject('roach.png', (200, 300), UPWARD)
ant = MovableObject('ant.png', (600, 400), UPWARD)


def redraw_screen():
    pygame.event.get()
    screen.blit(background, (0, 0))
    for obj in MovableObject.instances:
        if obj.is_visible:
            screen.blit(obj.image, obj.position)
    pygame.display.update()
    clock.tick(FPS)


def show(obj):
    obj.show()


def hide(obj):
    obj.hide()


def move_forward(obj, pixels=10):
    obj.move_forward(pixels)


def turn_left(obj, degrees=90):
    obj.turn(degrees)


def turn_right(obj, degrees=90):
    obj.turn(-1 * degrees)


def get_current_position(obj):
    return obj.image.get_rect().center


def is_at_the_edge(obj):
    return (
        obj.position.left <= 0 or
        obj.position.right >= SCREEN_WIDTH or
        obj.position.top <= 0 or
        obj.position.bottom >= SCREEN_HEIGHT)


def wait_for_keypress():
    while True:
        for event in pygame.event.get():
            if event.type in (pygame.QUIT, pygame.KEYDOWN):  # pylint: disable=no-member
                sys.exit()
