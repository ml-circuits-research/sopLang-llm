# 649 — Paths in a network with constraints

Given knowledge. Animals can respond to seasons through migration, hibernation, storing food, or changing their coat. In the model, a strategy succeeds if the animal secures energy, protection, and access to resources under the season’s conditions. Migration means seasonal movement between regions. Hibernation greatly reduces activity during certain periods.

Problem data. The network has bidirectional edges with the following costs: the shelter–feeding area:1; feeding area–the mild area:2; the shelter–the migration route:2; the migration route–cold zone:1; cold zone–the mild area:1; feeding area–cold zone:2. The link feeding area–the mild area is closed. The starting point is “the shelter”, the destination is “the mild area”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
