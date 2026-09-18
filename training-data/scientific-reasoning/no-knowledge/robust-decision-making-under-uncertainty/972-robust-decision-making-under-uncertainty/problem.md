# 972 — Robust decision-making under uncertainty

Given knowledge. In the model, the Moon does not produce its own visible light; it reflects sunlight. Half of the Moon is illuminated by the Sun, and the phase seen from Earth depends on the relative positions of the Sun, Earth, and Moon. Moon phases are not caused by Earth’s shadow; Earth’s shadow matters during a lunar eclipse. The Moon travels in orbit around Earth.

Problem data. The real state is unknown. The following scenarios are still possible: only “the direction of light is known” is faulty, only “the Moon’s position in its orbit is known” is faulty, only “the observer is on Earth” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels A, B, and C.
