# 719 — Paths in a network with constraints

Given knowledge. Energy can be transferred and transformed. In the model, a battery stores chemical energy, a circuit transfers it electrically, a bulb produces light and heat, and a motor produces motion and heat. A device does not create energy from nothing. Useful energy depends on the purpose of the device.

Problem data. The network has bidirectional edges with the following costs: the source–the cable:1; the cable–the external environment:2; the source–the converter:2; the converter–useful output:1; useful output–the external environment:1; the cable–useful output:2. The cable–the external environment link is closed. The starting point is “the source”, the destination is “the external environment”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
