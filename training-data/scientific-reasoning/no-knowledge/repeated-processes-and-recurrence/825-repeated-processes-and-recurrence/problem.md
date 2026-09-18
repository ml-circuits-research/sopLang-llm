# 825 — Repeated processes and recurrence

Given knowledge. Evaporation occurs at the surface of a liquid. In the model, a larger surface area, moving air, and a higher temperature can speed drying, while very humid air can slow it. Drying does not require water to boil. Spreading out a cloth increases its exposed surface area.

Problem data. The state x tracks the quantity “water” (unit: mL). We start with x₀=4. At each cycle: we add 3, we subtract 1, then we apply the cap 15: x_(t+1)=min(15, x_t+3-1). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
