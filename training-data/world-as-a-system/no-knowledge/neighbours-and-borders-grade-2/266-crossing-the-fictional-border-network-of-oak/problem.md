# 266 — Crossing the fictional border network of Oak

Knowledge context. Political maps can be treated as adjacency networks. This lets us reason about border crossings without relying on memorized real-world geography.

Given facts. Countries are represented by the fictional states Oak, Riverbend, Meadow, Willow, Northfield, Cedar. Shared borders: Oak–Riverbend, Riverbend–Meadow, Meadow–Willow, Oak–Northfield, Northfield–Cedar, Cedar–Willow.

Rules. Crossing one border corresponds to traversing one graph edge. A route may use only listed borders. A state is unavoidable only if every feasible route passes through it.

Task. What is the fewest number of border crossings needed to travel from Oak to Willow? Is Riverbend necessarily crossed?
