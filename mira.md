# Mira! Programming Course

[![](https://imgs.xkcd.com/comics/tags.png)](https://xkcd.com/1144/)

---

### 3rd session 14 May

#### Things to remember

A __flowchart__ is a graphical representation of a process. Procedures are represented by
rectangles, decisions are represented by diamonds, connected by arrows. The start and end points
(also called entry and exit points) of the process are represented by circles.

Hiding tiny details of a process by larger steps is called __abstraction__. Breaking a complex step
into smaller pieces is called __decomposition__. A complex system is always built up utilising
multiple __layers (or levels) of abstraction__. Putting small pieces together to build a complex
system is called __bottom-up approach__, while breaking complex components down to smaller pieces is
called __top-down approach__ to building the system.

> “All problems in computer science can be solved by another level of abstraction.” — David Wheeler,
> CS professor at Cambridge University

#### Homework for 21 May

1. __Exercise:__ Describe the process of your daily morning routine. Decompose it into multiple
   layers of abstraction (i.e. start with big steps, break them down into smaller steps, then the
   smaller steps into even smaller steps etc.)
2. Please download install the following applications:
    - [Python 3](https://www.python.org/downloads/) for running the Python programs we're going to
      write. Make sure to download the 3.x version.
    - [PyCharm](https://www.jetbrains.com/pycharm/) is a programmers' text editor for writing Python
      code. Download the free Community version instead of the trial version.
    - [Git](https://git-scm.com/downloads) is a version control system to save and share your work
      easily.
    - [GitAhead](http://gitahead.scitools.com/) is a graphical user interface for Git that is easy
      to learn. Download the free for non-commercial version instead of the trial version.
3. Revise the "Things to remember" of the 2nd and 3rd sessions.

---

### 2nd session 8 May

#### Things to remember

The "if a condition is true then do something else do something else" instruction is called a
__decision__ or __conditional__. Any declarative sentence can be used as a condition that is either
true or false.  Such sentences are called __logical statements__. The "repeat something while a
condition is true" instruction is called a __while loop__. The "repeat something n times"
instruction is called a __for loop__. Conditionals and loops are together called __control
statements__.

The "do a procedure" instruction is called a __call__ or __invocation__ of a procedure. In the
"turn left by _an angle_" and "open _an object_" procedures _an angle_ and _an object_ are
__variables__ because you can substitute any number for _an angle_ and various objects for _an
object_. Variables that procedures are invoked with are called the __arguments__ or __inputs__ of
the procedure.

Some procedures like "measure the distance" produce a result (in this case the distance) that is
called the __output__ or __return value__ of the procedure. Procedures that have return values are
called __functions__. In most modern languages like Python all procedures return some kind of result
and therefore all procedures are functions.

The procedures your robot already knew when it came out of the factory are called __built-in
procedures__. You can also borrow and use procedures that someone else wrote, they are called
__library procedures__.

A program that is written in everyday language but follows the logic of a programming language is
said to be written in __pseudocode__.


#### Homework for 15 May

Write a program in pseudocode that helps [Pac-Man](https://www.youtube.com/watch?v=i_OjztdQ8iw) (who
you can find in the bottom right corner) find his way in the maze to the Power Pellet (the large
orange dot in the top left corner). Bonus points if you can find a route that helps Pac-Man eat as
many Pac-dots (small orange dots) as possible on the way.

![](pacman.jpg)

Instead of repeating "go forward, go forward, go forward", use control statements.

##### The procedures Pac-Man can do:

- take one step forward
- turn left by 90°
- turn right by 90°
- check if you hit the wall

##### The instructions (control statements) Pac-Man can uderstand:

- Do _some procedures_.
- If _a condition_ is true, do _some procedures_.
- If _a condition_ is true, do _some procedures_, else do _some other procedures_.
- Repeat _some procedures_ while/until _a condition_ is true.
- Repeat _some procedures_ _n_ times.

---

### 1st session 24 April

The terms we were talking about: software, hardware, source code, function, variable, database,
file, CPU, memory, terminal, script, algorithm, operating system, client, server, front-end,
back-end, internet, world wide web, IP address

---
