# 699 — Paths in a network with constraints

Given knowledge. Evaporation occurs at the surface of a liquid. In the model, a larger surface area, moving air, and a higher temperature can speed drying, while very humid air can slow it. Drying does not require water to boil. Spreading out a cloth increases its exposed surface area.

Problem data. The network has bidirectional edges with the following costs: the shelf shaded–the windy zone:1; the windy zone–the weighing mass:2; the shelf shaded–the warm zone:2; the warm zone–humid chamber:1; humid chamber–the weighing mass:1; the windy zone–humid chamber:2. The windy zone–the weighing mass link is closed. The starting point is “the shelf shaded”, the destination is “the weighing mass”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
