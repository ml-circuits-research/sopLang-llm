# 845 — Repeated processes and recurrence

Given knowledge. Energy can be transferred and transformed. In the model, a battery stores chemical energy, a circuit transfers it electrically, a bulb produces light and heat, and a motor produces motion and heat. A device does not create energy from nothing. Useful energy depends on the purpose of the device.

Problem data. The state x tracks the quantity “energy” (unit: J-model). We start with x₀=2. At each cycle: we add 3, we subtract 1, then we apply the cap 14: x_(t+1)=min(14, x_t+3-1). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
