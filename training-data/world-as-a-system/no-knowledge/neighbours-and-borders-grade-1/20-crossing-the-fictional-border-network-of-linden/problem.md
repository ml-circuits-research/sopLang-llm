# 20 — Crossing the fictional border network of Linden

Knowledge context. Political maps can be treated as adjacency networks. This lets us reason about border crossings without relying on memorized real-world geography.

Given facts. Countries are represented by the fictional states Linden, Cedar, Northfield, Juniper, Alder, Willow. Shared borders: Linden–Cedar, Cedar–Northfield, Northfield–Juniper, Linden–Alder, Alder–Willow, Willow–Juniper.

Rules. Crossing one border corresponds to traversing one graph edge. A route may use only listed borders. A state is unavoidable only if every feasible route passes through it.

Task. What is the fewest number of border crossings needed to travel from Linden to Juniper? Is Cedar necessarily crossed?
