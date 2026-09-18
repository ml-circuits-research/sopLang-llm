# 724 — Paths in a network with constraints

Given knowledge. In the model, the Moon does not produce its own visible light; it reflects sunlight. Half of the Moon is illuminated by the Sun, and the phase seen from Earth depends on the relative positions of the Sun, Earth, and Moon. Moon phases are not caused by Earth’s shadow; Earth’s shadow matters during a lunar eclipse. The Moon travels in orbit around Earth.

Problem data. The network has bidirectional edges with the following costs: the Sun–Earth:1; Earth–the western position:2; the Sun–the eastern position:2; the eastern position–the position opposite the Sun:1; the position opposite the Sun–the western position:1; Earth–the position opposite the Sun:2. The eastern position–the position opposite the Sun link is closed. The starting point is “the Sun”, the destination is “the western position”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
