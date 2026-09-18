# 734 — Paths in a network with constraints

Given knowledge. In the hiking model, the map shows distances and elevation changes, weather can change speed, and the team has a limited reserve of water and energy. Layered clothing reduces heat loss under the stated cold conditions. Map scale allows map distance to be converted into real distance. Climbing uses more energy in the model than walking on level ground.

Problem data. The network has bidirectional edges with the following costs: cabin–the bridge:1; the bridge–the point of arrival:2; cabin–the step:2; the step–the spring:1; the spring–the point of arrival:1; the bridge–the spring:2. The step–the spring link is closed. The starting point is “cabin”, the destination is “the point of arrival”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
