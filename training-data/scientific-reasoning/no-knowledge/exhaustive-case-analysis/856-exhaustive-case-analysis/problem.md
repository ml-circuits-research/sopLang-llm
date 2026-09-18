# 856 — Exhaustive case analysis

Given knowledge. In the hiking model, the map shows distances and elevation changes, weather can change speed, and the team has a limited reserve of water and energy. Layered clothing reduces heat loss under the stated cold conditions. Map scale allows map distance to be converted into real distance. Climbing uses more energy in the model than walking on level ground.

Problem data. A=there is sufficient water; B=the route is open; C=the total time fits within the weather window. The target result is “the team reaches the destination within the model limits”. In this submodel, target appears exactly in cases in which exactly one condition is YES. Each letter can be YES or NO.

Question. Systematically enumerate all 8 A/B/C combinations and identify exactly the favorable cases. Explain why the enumeration is complete.
