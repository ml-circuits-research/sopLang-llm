# 694 — Paths in a network with constraints

Given knowledge. Air occupies space and can be compressed. In a model of a closed syringe, pushing the plunger decreases the volume of the air and increases pressure; if the air has a path out, pressure does not increase in the same way. Air is matter even though we cannot see it. A balloon can stretch when the pressure inside increases.

Problem data. The network has bidirectional edges with the following costs: the air chamber–the piston:1; the piston–the exterior:2; the air chamber–the opening:2; the opening–the side tube:1; the side tube–the exterior:1; the piston–the side tube:2. The opening–the side tube link is closed. The starting point is “the air chamber”, the destination is “the exterior”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
