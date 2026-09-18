# 848 — Discovering a rule from examples

Given knowledge. In the model, the Moon does not produce its own visible light; it reflects sunlight. Half of the Moon is illuminated by the Sun, and the phase seen from Earth depends on the relative positions of the Sun, Earth, and Moon. Moon phases are not caused by Earth’s shadow; Earth’s shadow matters during a lunar eclipse. The Moon travels in orbit around Earth.

Problem data. A means “the direction of light is known”, B means “the Moon’s position in its orbit is known”. A box applies the same unknown logical rule: A=NO, B=NO → result=YES; A=NO, B=YES → result=NO; A=YES, B=YES → result=NO. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
