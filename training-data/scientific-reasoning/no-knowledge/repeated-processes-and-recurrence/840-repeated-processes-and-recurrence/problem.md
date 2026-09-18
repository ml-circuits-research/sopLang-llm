# 840 — Repeated processes and recurrence

Given knowledge. In the circuit model, the metals used here are conductors, while plastic and rubber are insulators. Current appears only if there is a continuous conducting path between the source terminals; insulation is used to prevent contact with conducting parts. A conductor allows current to pass in the model. An insulator breaks the electrical path.

Problem data. The state x tracks the quantity “load in the model” (unit: load units). We start with x₀=4. At each cycle: we add 4, we subtract 2, then we apply the cap 13: x_(t+1)=min(13, x_t+4-2). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
