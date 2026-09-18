# 725 — Planning with partial dependencies

Given knowledge. In the model, the Moon does not produce its own visible light; it reflects sunlight. Half of the Moon is illuminated by the Sun, and the phase seen from Earth depends on the relative positions of the Sun, Earth, and Moon. Moon phases are not caused by Earth’s shadow; Earth’s shadow matters during a lunar eclipse. The Moon travels in orbit around Earth.

Problem data. The dependencies are: “light leaves the Sun” without prerequisites; “light reaches the Moon” after “light leaves the Sun”; “the half facing the Sun is illuminated” after “light leaves the Sun”; “the Moon reflects light” after “light reaches the Moon” and “the half facing the Sun is illuminated”; “the observer sees an illuminated fraction” after “the half facing the Sun is illuminated”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
