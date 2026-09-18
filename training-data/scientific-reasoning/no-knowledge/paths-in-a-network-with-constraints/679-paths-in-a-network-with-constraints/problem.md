# 679 — Paths in a network with constraints

Given knowledge. Two gears that touch directly rotate in opposite directions. In the model, if a small gear drives a larger gear, the larger gear makes fewer rotations in the same time; an odd or even number of contacts can change the final direction. The teeth prevent slipping in the ideal model. An intermediate gear can change direction without being the useful output.

Problem data. The network has bidirectional edges with the following costs: the input axle–the gear A:1; the gear A–the output axle:2; the input axle–the gear B:2; the gear B–the gear C:1; the gear C–the output axle:1; the gear A–the gear C:2. The gear A–the output axle link is closed. The starting point is “the input axle”, the destination is “the output axle”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
