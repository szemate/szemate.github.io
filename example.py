import random


random.seed()  # Please ignore this for now


def go_to_the_door():  # This is the main procedure
    print("Starting!")
    while not i_am_at_the_door():
        while not i_am_at_the_end_of_the_table():
            take_one_step_forward()
        if there_is_wall_on_the_left():
            turn_right()
        else:
            turn_left()
    print("Finished!")


def take_one_step_forward():
    print("I'm going forward!")


def turn_left():
    print("I'm turning left!")


def turn_right():
    print("I'm turning right!")


def i_am_at_the_door():
    print("Checking if I'm at the door...")
    random_result = random.choice([True, False])
    if random_result is True:
        print("  Yes, I'm at the door.")
    elif random_result is False:
        print("  No, I'm not at the door yet.")
    return random_result


def i_am_at_the_end_of_the_table():
    print("Checking if I'm at the end of the table...")
    random_result = random.choice([True, False])
    if random_result is True:
        print("  Yes, I'm at the end of the table.")
    elif random_result is False:
        print("  No, I'm at the end of the table yet.")
    return random_result


def there_is_wall_on_the_left():
    print("Checking if I can turn left...")
    random_result = random.choice([True, False])
    if random_result is True:
        print("  I cannot turn left because there is a wall.")
    elif random_result is False:
        print("  I can turn left because there is no wall.")
    return random_result


go_to_the_door()
