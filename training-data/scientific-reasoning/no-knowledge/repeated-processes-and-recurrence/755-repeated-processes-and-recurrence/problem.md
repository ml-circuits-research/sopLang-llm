# 755 — Repeated processes and recurrence

Given knowledge. In the simplified model, pollination succeeds when compatible pollen reaches a flower’s stigma. A visitor can touch a flower without carrying pollen, and carrying pollen does not help if the correct part of the flower is not touched. Nectar may attract insects, but nectar is not pollen. Some plants are pollinated mainly by animals, others mainly by wind.

Problem data. The state x tracks the quantity “portions of pollen” (unit: portions). We start with x₀=2. At each cycle: we add 3, we subtract 1, then we apply the cap 11: x_(t+1)=min(11, x_t+3-1). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
