# The Portfolio of Drue Gilbert

Welcome to my portfolio. You can view it deployed on GitHub Pages
[here](https://caseinpoint.github.io/).

My name is Drue, and my pronouns are they/them.  I'm a human being, maker,
nerd, teacher, and full-stack web developer. I built this page to showcase some
of my personal coding projects, things I find interesting and/or problems I've
needed to solve.

## Projects

- [13th Age Chaos Mage Spell App](./chaosmage/)
- [Photomap](./photomap/)
- [Knitting Row Counter App](./knitcounter/)
- [Student Lab Partner Generator App](https://github.com/caseinpoint/lab_partners)

## The colors, Duke, the colors!

![Screenshot of my deployed portfolio](./static/img/portfolio.png)

As self-promotion is not one of my strengths or desires, I needed something fun
to code in order to motivate myself to get this portfolio thing out there in
the world. I came across the creative coding JavaScript library,
[p5.js](https://p5js.org/), and decided to add it to this project. You can find
the source code that I wrote [here](./static/js/index.js).

To begin with, I wanted to do something with color. I'm red/green colorblind,
so color perception is somthing that's interesting to me. In investigating how
colors are displayed on a monitor, I learned about the cylindrical-coordinate
color model [HSV](https://en.wikipedia.org/wiki/HSL_and_HSV) (Hue, Saturation,
Value), and decided to play around with that.

Since Hue is an angle between 0° and 360°, I started by caclulating the angle
of the position of the mouse to the center of the page, and setting that as the
H value for the background color.

Saturation and Value are both percentages, but I wanted different approaches
for generating those numbers.

For Saturation, here's what I came up with:
1. I used p5's [mouseMoved](https://p5js.org/reference/#/p5/mouseMoved)
function to count how many times the mouse has moved and saved that to
a global `mouseFrames` variable
2. I took the modulo 360 of `mouseFrames` to get a number between 0° and 360°
3. I took the sine of that modulo to get the value going up and down in a wave
4. I used p5's [map](https://p5js.org/reference/#/p5/map) function to map the
sine to the 0 to 100 range for the S value of the background color
