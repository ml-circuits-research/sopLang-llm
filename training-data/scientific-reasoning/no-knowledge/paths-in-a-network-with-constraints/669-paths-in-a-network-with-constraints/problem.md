# 669 — Paths in a network with constraints

Given knowledge. Microorganisms can multiply on food when they find suitable conditions. In the model, cooling slows multiplication, drying reduces available water, and a clean container reduces initial contamination; none of these measures means that a food becomes sterile. Heat and moisture can speed some biological processes. “Cold” means slowing in the model, not absolute stopping.

Problem data. The network has bidirectional edges with the following costs: the model refrigerator–the dry shelf:1; the dry shelf–the dirty container:2; the model refrigerator–the warm mass:2; the warm mass–the clean container:1; the clean container–the dirty container:1; the dry shelf–the clean container:2. The shelf dry–the dirty container link is closed. The starting point is “the model refrigerator”, the destination is “the dirty container”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
