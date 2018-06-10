import inspect
import math
import sys

import pygame


FPS = 24
SCREEN_WIDTH = 1024
SCREEN_HEIGHT = 576
SCREEN_TOP = 30
UPWARD, DOWNWARD, LEFTWARD, RIGHTWARD = range(4)


pygame.init()  # pylint: disable=no-member

screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
background = pygame.image.load('grass.png').convert()
clock = pygame.time.Clock()
font = pygame.font.SysFont('monospace', 25)
last_message = None


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
            self.position.bottom = SCREEN_TOP
        elif self.position.bottom < SCREEN_TOP:
            self.position.top = SCREEN_HEIGHT


roach = MovableObject('roach.png', (200, 300), UPWARD)
ant = MovableObject('ant.png', (600, 400), UPWARD)


def redraw_screen():
    pygame.event.get()
    screen.blit(background, (0, 0))

    for obj in MovableObject.instances:
        if obj.is_visible:
            screen.blit(obj.image, obj.position)

    pygame.draw.rect(screen, (0, 0, 0), (0, 0, SCREEN_WIDTH, SCREEN_TOP))

    if last_message:
        put_text("MESSAGE: {}".format(last_message))

    current_code_line = get_current_code_line()
    if current_code_line:
        put_text("RUNNING: {}".format(current_code_line), align_right=True)

    pygame.display.update()
    clock.tick(FPS)


def show(obj):
    obj.show()


def hide(obj):
    obj.hide()


def move_forward(obj):
    obj.move_forward(20)


def turn_left(obj):
    obj.turn(90)
    obj.direction = {
        UPWARD: LEFTWARD,
        LEFTWARD: DOWNWARD,
        DOWNWARD: RIGHTWARD,
        RIGHTWARD: UPWARD,
    }[obj.direction]


def turn_right(obj):
    obj.turn(-90)
    obj.direction = {
        UPWARD: RIGHTWARD,
        RIGHTWARD: DOWNWARD,
        DOWNWARD: LEFTWARD,
        LEFTWARD: UPWARD,
    }[obj.direction]


def get_current_position(obj):
    return obj.image.get_rect().center


def get_distance(obj1, obj2):
    x1, y1 = get_current_position(obj1)
    x2, y2 = get_current_position(obj2)
    return int(math.sqrt(abs(x2 - x1) ** 2 + abs(y2 - y1) ** 2))


def is_at_the_edge(obj):
    return (
        obj.position.left <= 0 or
        obj.position.right >= SCREEN_WIDTH or
        obj.position.top <= 0 or
        obj.position.bottom >= SCREEN_HEIGHT)


def print_message(message):
    global last_message
    last_message = str(message)
    redraw_screen()


def get_current_code_line():
    if len(inspect.stack()) >= 5:
        return inspect.stack()[4][4][0].strip()
    return None


def put_text(text, align_right=False):
    label = font.render(text, 1, (255, 255, 255))
    x = SCREEN_WIDTH - label.get_width() - 10 if align_right else 10
    screen.blit(label, (x, 7))


def wait_for_keypress():
    while True:
        for event in pygame.event.get():
            if event.type in (pygame.QUIT, pygame.KEYDOWN):  # pylint: disable=no-member
                sys.exit()
