# 644 — Paths in a network with constraints

Given knowledge. Soil is a mixture that may contain mineral particles, humus, water, and air. In the model, a good layer for roots must retain some water while also leaving air spaces; too much water without air, or drainage that is too fast, can create problems. Sand generally has larger particles than clay. Humus comes from transformed organic remains.

Problem data. The network has bidirectional edges with the following costs: the sandy layer–the layer with humus:1; the layer with humus–the root zone:2; the sandy layer–the clayey layer:2; the clayey layer–the container of test:1; the container of test–the root zone:1; the layer with humus–the container of test:2. The layer clayey–the container of test link is closed. The starting point is “the sandy layer”, the destination is “the root zone”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
