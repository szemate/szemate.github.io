from library import redraw_screen, wait_for_keypress
from game import play


def main():
    redraw_screen()
    play()
    wait_for_keypress()


if __name__ == '__main__':
    main()
