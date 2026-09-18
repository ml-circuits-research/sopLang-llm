# 830 — Repeated processes and recurrence

Given knowledge. A mirror does not produce light; it changes the direction of light that reaches its surface. In the grid-ray model, the outgoing angle is symmetric with the incoming angle relative to the normal to the mirror. Light travels in straight lines in the uniform medium of the model. A matte surface scatters light in many directions.

Problem data. The state x tracks the quantity “segments of the light path” (unit: segments). We start with x₀=2. At each cycle: we add 4, we subtract 2, then we apply the cap 11: x_(t+1)=min(11, x_t+4-2). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
