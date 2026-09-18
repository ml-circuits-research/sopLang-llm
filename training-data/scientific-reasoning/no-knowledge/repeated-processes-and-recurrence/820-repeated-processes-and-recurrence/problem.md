# 820 — Repeated processes and recurrence

Given knowledge. Air occupies space and can be compressed. In a model of a closed syringe, pushing the plunger decreases the volume of the air and increases pressure; if the air has a path out, pressure does not increase in the same way. Air is matter even though we cannot see it. A balloon can stretch when the pressure inside increases.

Problem data. The state x tracks the quantity “air volume” (unit: mL). We start with x₀=3. At each cycle: we add 4, we subtract 2, then we apply the cap 14: x_(t+1)=min(14, x_t+4-2). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
