# 664 — Paths in a network with constraints

Given knowledge. During exercise, muscles need more oxygen and energy, and pulse and breathing may increase. after exercise stops, the values tend to return gradually toward the resting level. In the model, recovery is tracked by measurements taken at the same time intervals. Sweating can contribute to water loss. A single measurement does not describe the whole recovery process.

Problem data. The network has bidirectional edges with the following costs: the starting point–the effort path:1; the effort path–measurement mass:2; the starting point–the stopping point:2; the stopping point–rest zone:1; rest zone–measurement mass:1; the effort path–rest zone:2. The point of stopping–rest zone link is closed. The starting point is “the starting point”, the destination is “measurement mass”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
