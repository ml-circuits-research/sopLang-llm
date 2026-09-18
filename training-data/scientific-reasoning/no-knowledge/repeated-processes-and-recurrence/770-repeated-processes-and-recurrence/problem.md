# 770 — Repeated processes and recurrence

Given knowledge. Soil is a mixture that may contain mineral particles, humus, water, and air. In the model, a good layer for roots must retain some water while also leaving air spaces; too much water without air, or drainage that is too fast, can create problems. Sand generally has larger particles than clay. Humus comes from transformed organic remains.

Problem data. The state x tracks the quantity “water” (unit: mL). We start with x₀=2. At each cycle: we add 4, we subtract 2, then we apply the cap 14: x_(t+1)=min(14, x_t+4-2). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
