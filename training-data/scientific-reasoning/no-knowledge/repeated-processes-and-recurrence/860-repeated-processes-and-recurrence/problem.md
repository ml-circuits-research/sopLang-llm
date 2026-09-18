# 860 — Repeated processes and recurrence

Given knowledge. In the hiking model, the map shows distances and elevation changes, weather can change speed, and the team has a limited reserve of water and energy. Layered clothing reduces heat loss under the stated cold conditions. Map scale allows map distance to be converted into real distance. Climbing uses more energy in the model than walking on level ground.

Problem data. The state x tracks the quantity “water” (unit: model L). We start with x₀=2. At each cycle: we add 4, we subtract 2, then we apply the cap 12: x_(t+1)=min(12, x_t+4-2). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
