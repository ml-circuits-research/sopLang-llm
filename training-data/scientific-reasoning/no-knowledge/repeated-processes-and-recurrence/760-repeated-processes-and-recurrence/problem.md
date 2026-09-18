# 760 — Repeated processes and recurrence

Given knowledge. Seeds can be dispersed by wind, water, or animals. In the model, a seed reaches a new place only if it leaves the parent plant and remains capable of germinating after transport. Light seeds or seeds with wings can be carried more easily by wind. Some fruits have hooks that attach to fur.

Problem data. The state x tracks the quantity “seeds viable” (unit: seeds). We start with x₀=3. At each cycle: we add 4, we subtract 2, then we apply the cap 12: x_(t+1)=min(12, x_t+4-2). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
