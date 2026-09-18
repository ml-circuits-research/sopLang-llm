# 704 — Paths in a network with constraints

Given knowledge. A mirror does not produce light; it changes the direction of light that reaches its surface. In the grid-ray model, the outgoing angle is symmetric with the incoming angle relative to the normal to the mirror. Light travels in straight lines in the uniform medium of the model. A matte surface scatters light in many directions.

Problem data. The network has bidirectional edges with the following costs: the source–mirror 1:1; mirror 1–the obstacle:2; the source–mirror 2:2; mirror 2–the screen:1; the screen–the obstacle:1; mirror 1–the screen:2. The link mirror 2–the screen is closed. The starting point is “the source”, the destination is “the obstacle”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
