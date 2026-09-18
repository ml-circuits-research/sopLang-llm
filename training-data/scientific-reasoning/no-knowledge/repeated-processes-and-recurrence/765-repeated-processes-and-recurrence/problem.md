# 765 — Repeated processes and recurrence

Given knowledge. Fungi and bacteria can decompose organic remains. In the model, active decomposition needs decomposers, enough water, and a suitable temperature; the matter in the remains is transformed and some substances return to the soil. Dead leaves do not disappear instantly; decomposition has stages. Strong drying can slow the activity of many decomposers.

Problem data. The state x tracks the quantity “organic matter” (unit: mass units). We start with x₀=4. At each cycle: we add 3, we subtract 1, then we apply the cap 13: x_(t+1)=min(13, x_t+3-1). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
