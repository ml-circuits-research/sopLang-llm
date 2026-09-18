# 634 — Paths in a network with constraints

Given knowledge. Seeds can be dispersed by wind, water, or animals. In the model, a seed reaches a new place only if it leaves the parent plant and remains capable of germinating after transport. Light seeds or seeds with wings can be carried more easily by wind. Some fruits have hooks that attach to fur.

Problem data. The network has bidirectional edges with the following costs: the forest edge–the stream:1; the stream–the open meadow:2; the forest edge–the clearing:2; the clearing–the trail of the animals:1; the trail of the animals–the open meadow:1; the stream–the trail of the animals:2. The clearing–the trail of the animals link is closed. The starting point is “the forest edge”, the destination is “the open meadow”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
