# 982 — Robust decision-making under uncertainty

Given knowledge. In the hiking model, the map shows distances and elevation changes, weather can change speed, and the team has a limited reserve of water and energy. Layered clothing reduces heat loss under the stated cold conditions. Map scale allows map distance to be converted into real distance. Climbing uses more energy in the model than walking on level ground.

Problem data. The real state is unknown. The following scenarios are still possible: only “there is sufficient water” is faulty, only “the total time fits within the weather window” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels A and C.
