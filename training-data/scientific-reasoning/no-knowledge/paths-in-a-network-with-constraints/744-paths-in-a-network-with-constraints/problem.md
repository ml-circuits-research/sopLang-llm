# 744 — Paths in a network with constraints

Given knowledge. River water flows from upstream to downstream and can carry particles or substances. In the treatment-plant model, screening stops large objects, filtration retains smaller particles, and a separate disinfection stage is required to reduce microorganisms. A particle filter does not automatically remove all dissolved substances. A pollution source upstream can affect points downstream.

Problem data. The network has bidirectional edges with the following costs: the upstream village–moist zone:1; moist zone–the downstream city:2; the upstream village–the water outlet:2; the water outlet–the filtration station:1; the filtration station–the downstream city:1; moist zone–the filtration station:2. The outlet of water–the filtration station link is closed. The starting point is “the upstream village”, the destination is “the downstream city”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
