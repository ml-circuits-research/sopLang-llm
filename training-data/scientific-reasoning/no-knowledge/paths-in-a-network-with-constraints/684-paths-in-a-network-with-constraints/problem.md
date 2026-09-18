# 684 — Paths in a network with constraints

Given knowledge. An object remains stable in the model if the projection of its center of mass stays above its base of support. A wider base or moving mass inward can increase stability. In the model, the center of mass is the point at which we can treat mass as concentrated for balance analysis. Raising mass higher can make the system easier to tip.

Problem data. The network has bidirectional edges with the following costs: left of the base–the center of the base:1; the center of the base–the loading point:2; left of the base–right of the base:2; right of the base–the upper shelf:1; the upper shelf–the loading point:1; the center of the base–the upper shelf:2. The link right of the base–the upper shelf is closed. The starting point is “left of the base”, the destination is “the loading point”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
