# 805 — Repeated processes and recurrence

Given knowledge. Two gears that touch directly rotate in opposite directions. In the model, if a small gear drives a larger gear, the larger gear makes fewer rotations in the same time; an odd or even number of contacts can change the final direction. The teeth prevent slipping in the ideal model. An intermediate gear can change direction without being the useful output.

Problem data. The state x tracks the quantity “rotations” (unit: rotations). We start with x₀=3. At each cycle: we add 3, we subtract 1, then we apply the cap 11: x_(t+1)=min(11, x_t+3-1). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
