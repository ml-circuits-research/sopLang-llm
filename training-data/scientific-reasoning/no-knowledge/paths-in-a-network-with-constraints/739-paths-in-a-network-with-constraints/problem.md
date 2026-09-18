# 739 — Paths in a network with constraints

Given knowledge. In the home model, insulation slows heat transfer, natural light can reduce the use of electric lights, and electrical devices transform energy and also produce heat. The goal is comfort while using resources as efficiently as possible. Windows can provide light but can also be areas of heat transfer. A thick curtain can reduce some heat loss.

Problem data. The network has bidirectional edges with the following costs: the window–the insulated wall:1; the insulated wall–the meter:2; the window–the bulb:2; the bulb–the radiator:1; the radiator–the meter:1; the insulated wall–the radiator:2. The wall isolated–the meter link is closed. The starting point is “the window”, the destination is “the meter”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
