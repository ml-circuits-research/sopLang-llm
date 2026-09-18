# 16 — Crossing the fictional border network of Birch

Knowledge context. Political maps can be treated as adjacency networks. This lets us reason about border crossings without relying on memorized real-world geography.

Given facts. Countries are represented by the fictional states Birch, Cedar, Northfield, Pine, Alder, Willow. Shared borders: Birch–Cedar, Cedar–Northfield, Northfield–Pine, Birch–Alder, Alder–Willow, Willow–Pine.

Rules. Crossing one border corresponds to traversing one graph edge. A route may use only listed borders. A state is unavoidable only if every feasible route passes through it.

Task. What is the fewest number of border crossings needed to travel from Birch to Pine? Is Cedar necessarily crossed?
