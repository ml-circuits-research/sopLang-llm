# 800 — Repeated processes and recurrence

Given knowledge. A lever has a fulcrum, a load, and a place where effort is applied. In the numerical model, for the same load, moving the effort farther from the fulcrum can reduce the force required. The fulcrum is the point around which the lever rotates. The effort arm is the distance between the applied effort and the fulcrum.

Problem data. The state x tracks the quantity “mechanical work in the model” (unit: work units). We start with x₀=2. At each cycle: we add 4, we subtract 2, then we apply the cap 15: x_(t+1)=min(15, x_t+4-2). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
