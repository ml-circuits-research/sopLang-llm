# 790 — Repeated processes and recurrence

Given knowledge. During exercise, muscles need more oxygen and energy, and pulse and breathing may increase. after exercise stops, the values tend to return gradually toward the resting level. In the model, recovery is tracked by measurements taken at the same time intervals. Sweating can contribute to water loss. A single measurement does not describe the whole recovery process.

Problem data. The state x tracks the quantity “energy available” (unit: energy units). We start with x₀=3. At each cycle: we add 4, we subtract 2, then we apply the cap 13: x_(t+1)=min(13, x_t+4-2). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
