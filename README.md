# mandelbrot
visit https://thajay.github.io/mandelbrot/ to see it work

At the moment it renders deferred on canvas with vanilla js. Meaning:
- It first prepares all the pixels
- Then, one by one, it calculates and draws the pixels

Resolution is currently limited by the complex number implementation in use but this could probably be worked around.
This becomes most apparent when zooming in (there is no ui so that happens by editing constants). Speed is not so much of an issue until the precision of the calculation is dynamic.
