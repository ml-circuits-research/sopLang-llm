# 850 — Repeated processes and recurrence

Given knowledge. In the model, the Moon does not produce its own visible light; it reflects sunlight. Half of the Moon is illuminated by the Sun, and the phase seen from Earth depends on the relative positions of the Sun, Earth, and Moon. Moon phases are not caused by Earth’s shadow; Earth’s shadow matters during a lunar eclipse. The Moon travels in orbit around Earth.

Problem data. The state x tracks the quantity “light packets in the model” (unit: packets). We start with x₀=3. At each cycle: we add 4, we subtract 2, then we apply the cap 15: x_(t+1)=min(15, x_t+4-2). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
