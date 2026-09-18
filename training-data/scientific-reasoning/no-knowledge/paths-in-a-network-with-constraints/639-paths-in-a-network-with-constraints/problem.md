# 639 — Paths in a network with constraints

Given knowledge. Fungi and bacteria can decompose organic remains. In the model, active decomposition needs decomposers, enough water, and a suitable temperature; the matter in the remains is transformed and some substances return to the soil. Dead leaves do not disappear instantly; decomposition has stages. Strong drying can slow the activity of many decomposers.

Problem data. The network has bidirectional edges with the following costs: the pile of leaves–moist zone:1; moist zone–the box of compost:2; the pile of leaves–dry zone:2; dry zone–the layer of soil:1; the layer of soil–the box of compost:1; moist zone–the layer of soil:2. The link moist zone–the box of compost is closed. The starting point is “the pile of leaves”, the destination is “the box of compost”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
