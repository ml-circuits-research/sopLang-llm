# 674 — Paths in a network with constraints

Given knowledge. A lever has a fulcrum, a load, and a place where effort is applied. In the numerical model, for the same load, moving the effort farther from the fulcrum can reduce the force required. The fulcrum is the point around which the lever rotates. The effort arm is the distance between the applied effort and the fulcrum.

Problem data. The network has bidirectional edges with the following costs: the effort end–the fulcrum:1; the fulcrum–the free end:2; the effort end–task:2; task–the middle marker:1; the middle marker–the free end:1; the fulcrum–the middle marker:2. The link task–the middle marker is closed. The starting point is “the effort end”, the destination is “the free end”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
